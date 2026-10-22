package com.sustainability.ai;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiProviderFactory {

    private final AiConfig config;

    public AiProviderFactory(AiConfig config) {
        this.config = config;
    }

    @Bean
    public AiProvider aiProvider() {
        return switch (config.getProvider().toLowerCase()) {
            case "gemini"    -> new GeminiProvider(config);
            case "anthropic" -> new AnthropicProvider(config);
            default          -> new OpenAiProvider(config); // openai + ollama
        };
    }
}
