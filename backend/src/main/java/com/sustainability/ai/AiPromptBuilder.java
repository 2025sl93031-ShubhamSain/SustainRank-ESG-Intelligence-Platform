package com.sustainability.ai;

import java.util.List;
import java.util.Map;

public class AiPromptBuilder {

    public static String build(AiRecommendationRequest req) {
        if ("dashboard".equals(req.getType())) {
            return buildDashboardPrompt(req);
        }
        if ("report_analysis".equals(req.getType())) {
            return buildReportAnalysisPrompt(req);
        }
        if ("report_extraction".equals(req.getType())) {
            return buildExtractionPrompt(req);
        }
        return buildResultPrompt(req);
    }

    public static String buildExtractionPrompt(AiRecommendationRequest req) {
        Map<String, Object> details = req.getDetails();
        String excerpt = details != null && details.containsKey("report_excerpt")
                ? details.get("report_excerpt").toString() : "";

        return "You are an ESG data extraction specialist. Read the following text from a sustainability/ESG/BRSR report " +
               "and extract the values for the ESG indicators listed below. " +
               "Return ONLY a valid JSON object with exactly these keys. " +
               "Use null for any indicator not mentioned in the text. " +
               "Return numbers only (no units, no commas, no text). " +
               "Do not include any explanation, markdown, or text outside the JSON object.\n\n" +
               "Keys to extract:\n" +
               "- carbon_emissions_tco2e (total GHG / carbon emissions in tCO2e)\n" +
               "- energy_consumption_kwh (total energy consumption in kWh)\n" +
               "- renewable_pct (percentage of energy from renewable sources)\n" +
               "- waste_tonnes (total waste generated in tonnes)\n" +
               "- recycling_rate_pct (waste recycled or diverted, as a percentage)\n" +
               "- num_employees (total number of employees)\n" +
               "- revenue (total revenue in local currency)\n" +
               "- water_consumption_kl (total water consumption in kilolitres)\n" +
               "- scope1_emissions (Scope 1 GHG emissions in tCO2e)\n" +
               "- scope2_emissions (Scope 2 GHG emissions in tCO2e)\n" +
               "- scope3_emissions (Scope 3 GHG emissions in tCO2e)\n" +
               "- training_hours_per_employee (average training hours per employee per year)\n" +
               "- gender_ratio_pct (percentage of women / female employees)\n" +
               "- board_independence_pct (percentage of independent directors on the board)\n" +
               "- energy_intensity (energy consumption per unit of revenue or output)\n\n" +
               "Report text:\n" + excerpt;
    }

    private static String buildReportAnalysisPrompt(AiRecommendationRequest req) {
        Map<String, Object> details = req.getDetails();
        String excerpt = details != null && details.containsKey("report_excerpt")
                ? details.get("report_excerpt").toString() : "";

        StringBuilder sb = new StringBuilder();
        sb.append("You are an ESG analyst. Analyse the following excerpt from a sustainability/ESG report ");
        sb.append("and provide 3 to 5 specific, actionable insights about the company's ESG performance. ");
        sb.append("Focus on strengths, weaknesses, and improvement areas based on the data present. ");
        sb.append("Each insight must be one concise sentence. ");
        sb.append("Return only the bullet points, no preamble, no numbering. Start each line with a dash (-).\n\n");
        sb.append("Report excerpt:\n").append(excerpt);
        return sb.toString();
    }

    private static String buildResultPrompt(AiRecommendationRequest req) {
        String type = req.getType() != null ? req.getType() : "sustainability";
        double score = req.getScore() != null ? req.getScore() : 0;
        String industry = req.getIndustry() != null ? req.getIndustry() : "general";

        StringBuilder sb = new StringBuilder();
        sb.append("You are an ESG advisor. A company scored ").append(score)
          .append("/100 on their ").append(type).append(" assessment")
          .append(" in the ").append(industry).append(" sector.");

        if (req.getDetails() != null && !req.getDetails().isEmpty()) {
            sb.append(" Key metrics: ");
            req.getDetails().forEach((k, v) -> sb.append(k).append("=").append(v).append(", "));
        }

        sb.append("\nGive 3 to 5 specific, actionable improvement recommendations.")
          .append(" Each recommendation must be one concise sentence.")
          .append(" Return only the bullet points, no preamble, no numbering, no extra text.")
          .append(" Start each line with a dash (-).");

        return sb.toString();
    }

    private static String buildDashboardPrompt(AiRecommendationRequest req) {
        int rank = req.getRank() != null ? req.getRank() : 0;
        int total = req.getTotalCompanies() != null ? req.getTotalCompanies() : 0;
        double esg = req.getSustainabilityScore() != null ? req.getSustainabilityScore() : 0;
        double e   = req.getEnvironmentalScore()  != null ? req.getEnvironmentalScore()  : 0;
        double s   = req.getSocialScore()          != null ? req.getSocialScore()          : 0;
        double g   = req.getGovernanceScore()      != null ? req.getGovernanceScore()      : 0;
        String industry = req.getIndustry() != null ? req.getIndustry() : "general";

        return "You are an ESG advisor. This company ranks " + rank + " out of " + total + " peers" +
               " in the " + industry + " sector." +
               " ESG scores — Environmental: " + e + ", Social: " + s +
               ", Governance: " + g + ", Overall: " + esg + "." +
               "\nGive 3 to 5 specific improvement recommendations targeting their weakest pillar." +
               " Each recommendation must be one concise sentence." +
               " Return only the bullet points, no preamble, no numbering, no extra text." +
               " Start each line with a dash (-).";
    }
}
