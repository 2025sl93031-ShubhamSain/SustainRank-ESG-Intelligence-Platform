package com.sustainability.service;

import com.sustainability.dto.CarbonRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.util.CalcUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.sustainability.util.CalcUtils.*;

@Service
public class CarbonCalculatorService {

    private final ProfileService profileService;

    public CarbonCalculatorService(ProfileService profileService) {
        this.profileService = profileService;
    }

    @Transactional
    public Map<String, Object> calculate(CarbonRequest req, AppUser user) {
        int numEmployees       = Math.max(1, parseInt(req.getNumEmployees(), 1));
        double electricityKwh  = parseDouble(req.getElec(), 0);
        double gasM3           = parseDouble(req.getGas(), 0);
        double vehicleLitres   = parseDouble(req.getVefeul(), 0);
        double machineryLitres = parseDouble(req.getMachine(), 0);
        int shortFlights       = (int) parseDouble(req.getFlightsShort(), 0);
        double longFlightHrs   = parseDouble(req.getFlightsLong(), 0);
        double transportKm     = parseDouble(req.getTransexp(), 0);
        double renewablePct    = parseDouble(req.getRenewablePct(), 0);
        boolean recNewspaper   = "yes".equalsIgnoreCase(req.getNewspaperOptionsRadios());
        boolean recAluminum    = "yes".equalsIgnoreCase(req.getAlumtinOptionsRadios());
        String industry        = req.getIndustry() != null ? req.getIndustry() : "general";

        // Scope 1
        double scope1Gas      = (gasM3 * 12 * GAS_EF) / 1000;
        double scope1Vehicle  = (vehicleLitres * 12 * PETROL_EF) / 1000;
        double scope1Machinery= (machineryLitres * 12 * DIESEL_EF) / 1000;
        double scope1Total    = scope1Gas + scope1Vehicle + scope1Machinery;

        // Scope 2
        double effectiveEf = GRID_EF_INDIA * (1 - renewablePct / 100);
        double scope2Elec  = (electricityKwh * 12 * effectiveEf) / 1000;

        // Scope 3
        double scope3Flights = (shortFlights * SHORT_FLIGHT_EF) + (longFlightHrs * LONG_FLIGHT_EF);
        double scope3Commute = (transportKm * 12 * TRAIN_EF) / 1000;

        double totalTco2e = scope1Total + scope2Elec + scope3Flights + scope3Commute;

        // Recycling offset
        double offset = 0;
        if (recNewspaper) offset += 0.054;
        if (recAluminum)  offset += 0.108;
        totalTco2e = Math.max(0, totalTco2e - offset);

        double carbonIntensity = totalTco2e / numEmployees;
        String sector = sectorKey(industry);
        double benchmark = SECTOR_CARBON.get(sector);
        double countryAverage = 2.06;
        double worldTarget = 2.0;

        double carbonScore = round(percentileScore(carbonIntensity, benchmark, true), 1);

        // Save profile
        var profile = profileService.getOrCreateProfile(user);
        profile.setCarbonScore(round(totalTco2e, 2));
        profile.setCarbonIntensity(round(carbonIntensity, 3));
        profile.setElectricityUsage(electricityKwh);
        profile.setGasConsumption(gasM3);
        profile.setNumEmployees(numEmployees);
        profile.setIndustry(industry);
        profileService.saveProfile(profile);

        // Suggestions
        List<String> suggestions = carbonSuggestions(carbonIntensity, benchmark, recNewspaper, recAluminum, renewablePct);

        // Breakdown
        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("Scope 1 – Gas",        Map.of("id","s1_gas",  "value", round(scope1Gas,2),       "unit","tCO₂e/yr"));
        breakdown.put("Scope 1 – Vehicles",    Map.of("id","s1_veh",  "value", round(scope1Vehicle,2),   "unit","tCO₂e/yr"));
        breakdown.put("Scope 1 – Machinery",   Map.of("id","s1_mac",  "value", round(scope1Machinery,2), "unit","tCO₂e/yr"));
        breakdown.put("Scope 2 – Electricity", Map.of("id","s2_elec", "value", round(scope2Elec,2),      "unit","tCO₂e/yr"));
        breakdown.put("Scope 3 – Flights",     Map.of("id","s3_fl",   "value", round(scope3Flights,2),   "unit","tCO₂e/yr"));
        breakdown.put("Scope 3 – Commute",     Map.of("id","s3_cm",   "value", round(scope3Commute,2),   "unit","tCO₂e/yr"));

        Map<String, Object> ctx = new LinkedHashMap<>();
        ctx.put("heading", "Carbon Footprint Assessment");
        ctx.put("sub_heading", "Scope 1+2+3 emissions — " + capitalize(sector) + " sector benchmark: " + benchmark + " tCO₂e/employee/year");
        ctx.put("score", carbonScore);
        ctx.put("message", "Your organisation emits " + round(totalTco2e,1) + " tCO₂e/year ("
            + round(carbonIntensity,2) + " tCO₂e per employee). India avg: " + countryAverage + " t/capita. Paris target: " + worldTarget + " t/capita.");
        ctx.put("categories", categories());
        ctx.put("show_temp", true);
        ctx.put("country_average", countryAverage);
        ctx.put("world_average", worldTarget);
        ctx.put("suggestions", suggestions);
        ctx.put("show_breakdown", true);
        ctx.put("consumption_breakdown", breakdown);
        return ctx;
    }

    private List<String> carbonSuggestions(double intensity, double benchmark, boolean recPaper, boolean recAlum, double renPct) {
        List<String> tips = new ArrayList<>();
        if (intensity > benchmark * 1.5)
            tips.add("Your carbon intensity is significantly above sector average — consider a carbon reduction roadmap with annual targets.");
        if (intensity > benchmark)
            tips.add("You are " + (int)((intensity/benchmark - 1)*100) + "% above your sector benchmark. Prioritise Scope 2 reductions first — they are fastest and cheapest.");
        if (renPct < 30)
            tips.add("Switch to renewable electricity (solar rooftop or green tariff) — this directly cuts Scope 2 emissions and can halve your electricity carbon cost.");
        if (!recPaper)
            tips.add("Start a paper recycling programme to recover embedded carbon and divert waste from landfill.");
        if (!recAlum)
            tips.add("Recycling aluminium avoids up to 95% of the emissions of primary production — implement collection points.");
        tips.add("Conduct a Scope 3 supply-chain audit — upstream goods and services often account for 70%+ of total footprint.");
        tips.add("Set a Science-Based Target (SBT) aligned with 1.5°C to signal credibility to stakeholders and investors.");
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
