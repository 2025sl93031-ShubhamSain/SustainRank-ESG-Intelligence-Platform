package com.sustainability.service;

import com.sustainability.dto.SustainabilityRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.util.CalcUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

import static com.sustainability.util.CalcUtils.*;

@Service
public class SustainabilityScoreService {

    private final ProfileService profileService;
    private final HistoryService historyService;

    public SustainabilityScoreService(ProfileService profileService, HistoryService historyService) {
        this.profileService = profileService;
        this.historyService = historyService;
    }

    @Transactional
    public Map<String, Object> calculate(SustainabilityRequest req, AppUser user) {
        var profile = profileService.getOrCreateProfile(user);

        String industry      = notBlank(req.getIndustry(), notBlank(profile.getIndustry(), "general"));
        double carbonEmissions   = parseDoubleOr(req.getCarbon(),       profile.getCarbonScore());
        double energyConsumption = parseDoubleOr(req.getEnergy(),       profile.getEnergyTotal());
        double wasteProduction   = parseDoubleOr(req.getWaste(),        profile.getTotalWaste());
        double eevtaScore        = parseDoubleOr(req.getEvtaa(),        profile.getEevtaScore());
        int numEmployees         = Math.max(1, (int) parseDoubleOr(req.getNumEmployees(), profile.getNumEmployees()));
        double renewablePct      = parseDoubleOr(req.getRenewablePct(), profile.getRenewablePct());
        double wasteDiversion    = parseDoubleOr(req.getWasteDiversion(), profile.getWasteDiversionRate());
        double revenue    = parseDouble(req.getRevenue(), 0);
        double costs      = parseDouble(req.getCost(), 0);
        double investment = parseDouble(req.getInv(), 0);

        String sector = sectorKey(industry);

        // Environmental Score (E)
        double carbonIntensity      = carbonEmissions / numEmployees;
        double carbonSub            = percentileScore(carbonIntensity, SECTOR_CARBON.get(sector), true);
        double energyIntensity      = energyConsumption / numEmployees;
        double energyIntensityScore = percentileScore(energyIntensity, SECTOR_ENERGY.get(sector), true);
        double energySub            = clamp(energyIntensityScore * 0.70 + renewablePct * 0.30);
        double wasteSub             = percentileScore(wasteDiversion, SECTOR_WASTE.get(sector), false);
        double environmentalScore   = round(clamp(carbonSub * 0.40 + energySub * 0.35 + wasteSub * 0.25), 2);

        // Social Score (S)
        double socialScore = round(clamp(eevtaScore), 2);

        // Governance Score (G)
        double profit           = revenue - costs;
        double profitMargin     = revenue > 0 ? clamp(profit / revenue * 100) : 50;
        double susInvestRatio   = revenue > 0 ? clamp(investment / revenue * 100) : 0;
        double governanceScore  = round(clamp(profitMargin * 0.60 + susInvestRatio * 0.40), 2);

        // ESG Composite
        double sustainabilityScore = round(clamp(
            environmentalScore * 0.50 +
            socialScore        * 0.30 +
            governanceScore    * 0.20
        ), 2);

        // ROI
        double financialRoi = investment > 0 ? round((profit / investment) * 100, 2) : 0;
        double carbonCreditValue  = carbonEmissions * 1200;
        double energySavingValue  = energyConsumption * 0.05;
        double wasteSavingValue   = wasteProduction * 2.0;
        double sustainabilityValue = carbonCreditValue + energySavingValue + wasteSavingValue;
        double blendedBenefit     = profit + sustainabilityValue;
        double blendedRoi         = investment > 0 ? round((blendedBenefit / investment) * 100, 2) : financialRoi;
        double costBenefit        = investment > 0 ? round(blendedBenefit / investment, 2) : 0;

        // Heading
        String heading, sub;
        if (sustainabilityScore >= 80) {
            heading = "Sustainability Leader";
            sub = "Your organisation is performing at ESG best-practice level.";
        } else if (sustainabilityScore >= 60) {
            heading = "Sustainability Performer";
            sub = "Good progress — targeted improvements can move you into the top tier.";
        } else if (sustainabilityScore >= 40) {
            heading = "Developing Sustainability";
            sub = "Foundations are in place; structured action on E, S & G pillars needed.";
        } else {
            heading = "Sustainability Action Required";
            sub = "Significant gaps across E, S & G. A structured roadmap is essential.";
        }

        // Save profile
        profile.setIndustry(industry);
        profile.setCarbonScore(carbonEmissions);
        profile.setEnergyTotal(energyConsumption);
        profile.setTotalWaste(wasteProduction);
        profile.setEevtaScore(eevtaScore);
        profile.setNumEmployees(numEmployees);
        profile.setEnvironmentalScore(environmentalScore);
        profile.setSocialScore(socialScore);
        profile.setSustainabilityScore(sustainabilityScore);
        profile.setRoi(blendedRoi);
        profile.setCostBenefit(costBenefit);
        profileService.saveProfile(profile);

        historyService.saveToHistory(user, revenue, costs, investment, environmentalScore, socialScore);

        Map<String, Object> ctx = new LinkedHashMap<>();
        ctx.put("heading", heading);
        ctx.put("sub_heading", sub);
        ctx.put("sustainability_score", sustainabilityScore);
        ctx.put("environmental_score", environmentalScore);
        ctx.put("social_score", socialScore);
        ctx.put("governance_score", governanceScore);
        ctx.put("roi", blendedRoi);
        ctx.put("cost_benefit", costBenefit);
        ctx.put("financial_roi", financialRoi);
        return ctx;
    }

    private String notBlank(String val, String fallback) {
        return (val != null && !val.isBlank()) ? val : fallback;
    }

    private double parseDoubleOr(String strVal, double profileVal) {
        if (strVal == null || strVal.isBlank()) return profileVal;
        try { return Double.parseDouble(strVal.trim()); }
        catch (NumberFormatException e) { return profileVal; }
    }

    private double parseDoubleOr(String strVal, int profileVal) {
        return parseDoubleOr(strVal, (double) profileVal);
    }
}
