package com.sustainability.ai;

import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

public class GeminiProvider implements AiProvider {

    private final AiConfig config;

    public GeminiProvider(AiConfig config) {
        this.config = config;
    }

    @Override
    public List<String> getRecommendations(AiRecommendationRequest request) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + config.getModel() + ":generateContent?key=" + config.getApiKey();

        var client = RestClient.builder()
                .defaultHeader("Content-Type", "application/json")
                .build();

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", AiPromptBuilder.build(request)))
                ))
        );

        var response = client.post()
                .uri(url)
                .body(body)
                .retrieve()
                .body(Map.class);

        return AiResponseParser.parseGemini(response);
    }
}
