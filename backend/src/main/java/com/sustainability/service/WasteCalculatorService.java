package com.sustainability.service;

import com.sustainability.dto.WasteRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.util.CalcUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.sustainability.util.CalcUtils.*;

@Service
public class WasteCalculatorService {

    private final ProfileService profileService;

    public WasteCalculatorService(ProfileService profileService) {
        this.profileService = profileService;
    }

    @Transactional
    public Map<String, Object> calculate(WasteRequest req, AppUser user) {
        double solidWaste    = parseDouble(req.getSwaste(), 0);
        double organicWaste  = parseDouble(req.getOwaste(), 0);
        double eWaste        = parseDouble(req.getEwaste(), 0);
        double hazardous     = parseDouble(req.getHwaste(), 0);
        double recycled      = parseDouble(req.getRcycwaste(), 0);
        double composted     = parseDouble(req.getComposted(), 0);
        String industry      = req.getIndustry() != null ? req.getIndustry() : "general";

        double totalWaste  = solidWaste + organicWaste + eWaste + hazardous;
        double diverted    = Math.min(recycled + composted, totalWaste);
        double landfill    = Math.max(0, totalWaste - diverted);
        double diversionPct = totalWaste > 0 ? round((diverted / totalWaste) * 100, 1) : 0;
        double hazardousPct = totalWaste > 0 ? (hazardous / totalWaste * 100) : 0;

        String sector    = sectorKey(industry);
        double benchmark = SECTOR_WASTE.get(sector);

        double diversionScore   = percentileScore(diversionPct, benchmark, false);
        double hazardousPenalty = clamp(hazardousPct * 2, 0, 25);
        double wasteScore       = round(clamp(diversionScore - hazardousPenalty), 1);

        // Save
        var profile = profileService.getOrCreateProfile(user);
        profile.setTotalWaste(round(totalWaste, 2));
        profile.setRecycledWaste(round(recycled, 2));
        profile.setCompostedWaste(round(composted, 2));
        profile.setWasteReductionRate(diversionPct);
        profile.setWasteDiversionRate(diversionPct);
        profileService.saveProfile(profile);

        // Breakdown
        Map<String, Object> wasteBreakdown = new LinkedHashMap<>();
        wasteBreakdown.put("Solid Waste",     Map.of("id","sw",   "value", round(solidWaste,1),   "unit","kg/mo"));
        wasteBreakdown.put("Organic Waste",   Map.of("id","ow",   "value", round(organicWaste,1), "unit","kg/mo"));
        wasteBreakdown.put("E-Waste",         Map.of("id","ew",   "value", round(eWaste,1),       "unit","kg/mo"));
        wasteBreakdown.put("Hazardous Waste", Map.of("id","hw",   "value", round(hazardous,1),    "unit","kg/mo"));
        wasteBreakdown.put("Total Generated", Map.of("id","tot",  "value", round(totalWaste,1),   "unit","kg/mo"));
        wasteBreakdown.put("Recycled",        Map.of("id","rec",  "value", round(recycled,1),     "unit","kg/mo"));
        wasteBreakdown.put("Composted",       Map.of("id","comp", "value", round(composted,1),    "unit","kg/mo"));
        wasteBreakdown.put("Landfilled",      Map.of("id","land", "value", round(landfill,1),     "unit","kg/mo"));

        Map<String, Object> ctx = new LinkedHashMap<>();
        ctx.put("score", wasteScore);
        ctx.put("heading", "Waste Management Assessment");
        ctx.put("sub_heading", "GRI 306 waste diversion methodology — " + capitalize(sector) + " benchmark: " + (int)benchmark + "% diversion");
        ctx.put("message", "You divert " + diversionPct + "% of waste from landfill ("
            + Math.round(diverted) + " kg/month recycled + composted out of " + Math.round(totalWaste) + " kg total). Sector benchmark: " + (int)benchmark + "%.");
        ctx.put("categories", categories());
        ctx.put("show_waste_breakdown", true);
        ctx.put("waste_breakdown", wasteBreakdown);
        ctx.put("suggestions", wasteSuggestions(diversionPct, benchmark, hazardousPct, composted));
        return ctx;
    }

    private List<String> wasteSuggestions(double diversionPct, double benchmark, double hazPct, double composted) {
        List<String> tips = new ArrayList<>();
        if (diversionPct < benchmark)
            tips.add("Your diversion rate (" + diversionPct + "%) is below the sector benchmark (" + (int)benchmark + "%). Introduce segregation at source — it is the single highest-impact action.");
        if (hazPct > 10)
            tips.add((int)Math.round(hazPct) + "% of your waste is hazardous. Partner with a licensed hazardous waste handler and implement substitution policies to reduce generation.");
        if (composted == 0)
            tips.add("You are not composting organic waste. On-site composting can divert 30–50% of food/green waste and produce useful fertiliser.");
        tips.add("Conduct a waste composition audit every 6 months to identify the largest divertible fractions.");
        tips.add("Join a Producer Responsibility Organisation (PRO) for e-waste to ensure certified recycling and avoid regulatory penalties.");
        tips.add("Target a Zero Waste to Landfill certification (e.g., UL 2799) — increasingly required by ESG-focused investors.");
        return tips.subList(0, Math.min(5, tips.size()));
    }

    private Map<String, Object> categories() {
        Map<String, Object> cats = new LinkedHashMap<>();
        cats.put("Excellent", Map.of("range", List.of(80,100), "color","success"));
        cats.put("Good",      Map.of("range", List.of(60,79),  "color","info"));
        cats.put("Average",   Map.of("range", List.of(40,59),  "color","warning"));
        cats.put("Poor",      Map.of("range", List.of(0,39),   "color","danger"));
        return cats;
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
