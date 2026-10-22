package com.sustainability.ai;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class AiPromptBuilderTest {

    // ── result prompt ─────────────────────────────────────────────────────────

    @Test
    void resultPrompt_containsScoreAndType() {
        AiRecommendationRequest req = new AiRecommendationRequest();
        req.setType("carbon");
        req.setScore(67.4);
        req.setIndustry("manufacturing");

        String prompt = AiPromptBuilder.build(req);

        assertThat(prompt).contains("67.4").contains("carbon").contains("manufacturing");
    }

    @Test
    void resultPrompt_containsInstructions() {
        AiRecommendationRequest req = new AiRecommendationRequest();
        req.setType("energy");
        req.setScore(50.0);
        req.setIndustry("it");

        String prompt = AiPromptBuilder.build(req);

        assertThat(prompt)
                .contains("3 to 5")
                .contains("Start each line with a dash");
    }

    @Test
    void resultPrompt_includesDetailsWhenPresent() {
        AiRecommendationRequest req = new AiRecommendationRequest();
        req.setType("carbon");
        req.setScore(40.0);
        req.setIndustry("general");
        req.setDetails(Map.of("carbonIntensity", 12.3));

        String prompt = AiPromptBuilder.build(req);

        assertThat(prompt).contains("carbonIntensity").contains("12.3");
    }

    @Test
    void resultPrompt_handlesNullFieldsWithDefaults() {
        AiRecommendationRequest req = new AiRecommendationRequest();
        // all fields null

        String prompt = AiPromptBuilder.build(req);

        assertThat(prompt).contains("sustainability").contains("general").contains("0.0");
    }

    // ── dashboard prompt ──────────────────────────────────────────────────────

    @Test
    void dashboardPrompt_containsRankAndPeerCount() {
        AiRecommendationRequest req = dashboardRequest();

        String prompt = AiPromptBuilder.build(req);

        assertThat(prompt).contains("3").contains("11");
    }

    @Test
    void dashboardPrompt_containsAllPillarScores() {
        AiRecommendationRequest req = dashboardRequest();

        String prompt = AiPromptBuilder.build(req);

        assertThat(prompt)
                .contains("61.0")   // environmental
                .contains("55.0")   // social
                .contains("48.5")   // governance
                .contains("58.2");  // overall
    }

    @Test
    void dashboardPrompt_targetsWeakestPillar() {
        AiRecommendationRequest req = dashboardRequest();

        String prompt = AiPromptBuilder.build(req);

        assertThat(prompt).contains("weakest pillar");
    }

    @Test
    void dashboardPrompt_containsInstructions() {
        AiRecommendationRequest req = dashboardRequest();

        String prompt = AiPromptBuilder.build(req);

        assertThat(prompt)
                .contains("3 to 5")
                .contains("Start each line with a dash");
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private AiRecommendationRequest dashboardRequest() {
        AiRecommendationRequest req = new AiRecommendationRequest();
        req.setType("dashboard");
        req.setRank(3);
        req.setTotalCompanies(11);
        req.setSustainabilityScore(58.2);
        req.setEnvironmentalScore(61.0);
        req.setSocialScore(55.0);
        req.setGovernanceScore(48.5);
        req.setIndustry("manufacturing");
        return req;
    }
}
