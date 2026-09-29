package com.sustainability.service;

import com.sustainability.dto.EevtaRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.util.CalcUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.sustainability.util.CalcUtils.*;

@Service
public class EevtaCalculatorService {

    private final ProfileService profileService;

    public EevtaCalculatorService(ProfileService profileService) {
        this.profileService = profileService;
    }

    @Transactional
    public Map<String, Object> calculate(EevtaRequest req, AppUser user) {
        int totalEmployees    = Math.max(1, parseInt(req.getTotalStudents(), 1));
        int trainedEmployees  = parseInt(req.getTechVocStudents(), 0);
        int remoteEmployees   = parseInt(req.getDistanceLearning(), 0);
        int benefitEmployees  = parseInt(req.getScholarshipStudents(), 0);
        double welfareAidPct  = clamp(parseDouble(req.getFinancialAid(), 0));
        double retentionRate  = clamp(parseDouble(req.getGradRate(), 0));
        double internalPromo  = clamp(parseDouble(req.getEmploymentRate(), 0));
        double femalePct      = clamp(parseDouble(req.getFemaleEnrolment(), 0));
        boolean disabilityInclusive = "yes".equalsIgnoreCase(req.getDisabilityAccess());

        double trainingPct = (double) trainedEmployees / totalEmployees * 100;
        double remotePct   = (double) remoteEmployees  / totalEmployees * 100;
        double benefitPct  = (double) benefitEmployees / totalEmployees * 100;

        double trainingScore  = clamp(trainingPct / 40 * 100);
        double remoteScore    = clamp(remotePct   / 20 * 100);
        double benefitScore   = clamp(benefitPct  / 50 * 100);
        double welfareScore   = clamp(welfareAidPct / 30 * 100);
        double retentionScore = retentionRate;
        double promotionScore = internalPromo;
        double genderScore    = clamp(100 - Math.abs(femalePct - 50) * 2);
        double inclusionBonus = disabilityInclusive ? 5 : 0;

        double socialRaw = trainingScore  * 0.25
                         + remoteScore    * 0.10
                         + benefitScore   * 0.15
                         + welfareScore   * 0.10
                         + retentionScore * 0.20
                         + promotionScore * 0.15
                         + genderScore    * 0.05;
        double finalScore = round(clamp(socialRaw + inclusionBonus), 1);

        // Save
        var profile = profileService.getOrCreateProfile(user);
        profile.setEevtaScore(finalScore);
        profile.setTotalStudents(totalEmployees);
        profile.setTechVocPercentage(trainingPct);
        profileService.saveProfile(profile);

        // Breakdown
        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("Skill Training Coverage", Map.of("id","trn", "value", round(trainingScore,1),  "unit","/100"));
        breakdown.put("Flexible Work Access",    Map.of("id","rem", "value", round(remoteScore,1),    "unit","/100"));
        breakdown.put("Benefits Coverage",       Map.of("id","ben", "value", round(benefitScore,1),   "unit","/100"));
        breakdown.put("Financial Wellness",      Map.of("id","wel", "value", round(welfareScore,1),   "unit","/100"));
        breakdown.put("Employee Retention",      Map.of("id","ret", "value", round(retentionScore,1), "unit","/100"));
        breakdown.put("Internal Promotions",     Map.of("id","pro", "value", round(promotionScore,1), "unit","/100"));

        Map<String, Object> ctx = new LinkedHashMap<>();
        ctx.put("score", finalScore);
        ctx.put("heading", "Workforce Development Score");
        ctx.put("sub_heading", "SDG 8 Decent Work — measures training, equity, retention and employee wellbeing");
        ctx.put("message", "Your organisation scores " + finalScore + "/100 on workforce development. Training coverage: "
            + round(trainingPct,1) + "%, retention rate: " + retentionRate + "%, internal promotion rate: " + internalPromo + "%.");
        ctx.put("categories", categories());
        ctx.put("show_breakdown", true);
        ctx.put("consumption_breakdown", breakdown);
        ctx.put("suggestions", socialSuggestions(trainingPct, benefitPct, retentionRate, internalPromo, femalePct));
        return ctx;
    }

    private List<String> socialSuggestions(double trainingPct, double benefitPct, double retention, double promotion, double femalePct) {
        List<String> tips = new ArrayList<>();
        if (trainingPct < 40)
            tips.add("Only " + (int)Math.round(trainingPct) + "% of employees received skill training this year — below the 40% target. Structured L&D programmes directly improve retention and productivity.");
        if (benefitPct < 50)
            tips.add("Benefits coverage is " + (int)Math.round(benefitPct) + "%. Expanding health insurance, wellness allowances and EAP programmes to all employees improves both scores and talent retention.");
        if (retention < 80)
            tips.add("Retention rate of " + (int)retention + "% indicates potential culture or compensation gaps. Exit interviews and engagement surveys are the fastest diagnostic tool.");
        if (promotion < 20)
            tips.add("Internal promotion rate of " + (int)promotion + "% is low. Defined career pathways and succession planning reduce recruitment costs and improve engagement.");
        if (femalePct < 40)
            tips.add("Female workforce is " + (int)Math.round(femalePct) + "%. Setting a 40–50% gender target with transparent pay equity audits strengthens both ESG scores and talent pipeline.");
        tips.add("Publish an annual Workforce Development Report aligned to GRI 401–405 to demonstrate SDG 8 commitment to investors and stakeholders.");
        return tips.subList(0, Math.min(5, tips.size()));
    }

    private Map<String, Object> categories() {
        Map<String, Object> cats = new LinkedHashMap<>();
        cats.put("Excellent",    Map.of("range", List.of(85,100), "color","success"));
        cats.put("Good",         Map.of("range", List.of(70,84),  "color","info"));
        cats.put("Developing",   Map.of("range", List.of(50,69),  "color","warning"));
        cats.put("Needs Action", Map.of("range", List.of(0,49),   "color","danger"));
        return cats;
    }
}
