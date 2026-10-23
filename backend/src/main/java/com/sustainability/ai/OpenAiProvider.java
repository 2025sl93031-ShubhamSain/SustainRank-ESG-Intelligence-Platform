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
        String baseUrl = config.getBaseUrl().isBlank()
                ? "https://api.openai.com"
                : config.getBaseUrl();

        var client = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + config.getApiKey())
                .defaultHeader("Content-Type", "application/json")
                .build();

        Map<String, Object> body = Map.of(
                "model", config.getModel(),
                "max_tokens", 400,
                "messages", List.of(Map.of("role", "user", "content", AiPromptBuilder.build(request)))
        );

        var response = client.post()
                .uri("/v1/chat/completions")
                .body(body)
                .retrieve()
                .body(Map.class);

        return AiResponseParser.parseOpenAi(response);
    }
}
