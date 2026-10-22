package com.sustainability.ai;

import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

public class AnthropicProvider implements AiProvider {

    private final AiConfig config;

    public AnthropicProvider(AiConfig config) {
        this.config = config;
    }

    @Override
    public List<String> getRecommendations(AiRecommendationRequest request) {
        var client = RestClient.builder()
                .baseUrl("https://api.anthropic.com")
                .defaultHeader("x-api-key", config.getApiKey())
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("Content-Type", "application/json")
                .build();

        Map<String, Object> body = Map.of(
                "model", config.getModel(),
                "max_tokens", 400,
                "messages", List.of(Map.of("role", "user", "content", AiPromptBuilder.build(request)))
        );

        var response = client.post()
                .uri("/v1/messages")
                .body(body)
                .retrieve()
                .body(Map.class);

        return AiResponseParser.parseAnthropic(response);
    }
}
