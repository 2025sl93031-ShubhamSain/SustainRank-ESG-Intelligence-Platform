package com.sustainability.ai;

public class AiPromptBuilder {

    public static String build(AiRecommendationRequest req) {
        if ("dashboard".equals(req.getType())) {
            return buildDashboardPrompt(req);
        }
        return buildResultPrompt(req);
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
