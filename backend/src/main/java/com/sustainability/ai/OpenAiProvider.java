package com.sustainability.ai;

import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

public class OpenAiProvider implements AiProvider {

    private final AiConfig config;

    public OpenAiProvider(AiConfig config) {
        this.config = config;
    }

    @Override
    public List<String> getRecommendations(AiRecommendationRequest request) {
        var response = callApi(request, 400);
        return AiResponseParser.parseOpenAi(response);
    }

    @Override
    public Map<String, Double> extractMetrics(AiRecommendationRequest request) {
        var response = callApi(request, 600);
        return AiResponseParser.parseJsonOpenAi(response);
    }

    private Map<?, ?> callApi(AiRecommendationRequest request, int maxTokens) {
        String baseUrl = config.getBaseUrl().isBlank()
                ? "https://api.openai.com"
                : config.getBaseUrl();

        var client = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + config.getApiKey())
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("HTTP-Referer", "http://localhost:5173")
                .defaultHeader("X-Title", "SustainRank")
                .build();

        Map<String, Object> body = Map.of(
                "model", config.getModel(),
                "max_tokens", maxTokens,
                "messages", List.of(Map.of("role", "user", "content", AiPromptBuilder.build(request)))
        );

        return client.post()
                .uri("/v1/chat/completions")
                .body(body)
                .retrieve()
                .body(Map.class);
    }
}
