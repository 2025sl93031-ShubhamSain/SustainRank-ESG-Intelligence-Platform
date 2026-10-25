package com.sustainability.ai;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class AiResponseParserTest {

    // ── OpenAI ────────────────────────────────────────────────────────────────

    @Test
    void parseOpenAi_extractsBulletLines() {
        Map<?, ?> response = openAiResponse("- Reduce grid electricity.\n- Switch to renewables.\n- Offset remaining emissions.");

        List<String> result = AiResponseParser.parseOpenAi(response);

        assertThat(result).hasSize(3);
        assertThat(result.get(0)).isEqualTo("Reduce grid electricity.");
        assertThat(result.get(1)).isEqualTo("Switch to renewables.");
    }

    @Test
    void parseOpenAi_stripsLeadingDashAndBulletVariants() {
        Map<?, ?> response = openAiResponse("- dash\n• bullet\n* star");

        List<String> result = AiResponseParser.parseOpenAi(response);

        assertThat(result).containsExactly("dash", "bullet", "star");
    }

    @Test
    void parseOpenAi_returnsEmptyOnNull() {
        assertThat(AiResponseParser.parseOpenAi(null)).isEmpty();
    }

    @Test
    void parseOpenAi_returnsEmptyOnMalformedResponse() {
        assertThat(AiResponseParser.parseOpenAi(Map.of("unexpected", "shape"))).isEmpty();
    }

    @Test
    void parseOpenAi_skipsBlankLines() {
        Map<?, ?> response = openAiResponse("- First rec.\n\n- Second rec.");

        List<String> result = AiResponseParser.parseOpenAi(response);

        assertThat(result).hasSize(2);
    }

    // ── Gemini ────────────────────────────────────────────────────────────────

    @Test
    void parseGemini_extractsBulletLines() {
        Map<?, ?> response = geminiResponse("- Improve waste diversion.\n- Increase recycling rate.");

        List<String> result = AiResponseParser.parseGemini(response);

        assertThat(result).hasSize(2);
        assertThat(result.get(0)).isEqualTo("Improve waste diversion.");
    }

    @Test
    void parseGemini_returnsEmptyOnNull() {
        assertThat(AiResponseParser.parseGemini(null)).isEmpty();
    }

    @Test
    void parseGemini_returnsEmptyOnMalformedResponse() {
        assertThat(AiResponseParser.parseGemini(Map.of("wrong", "key"))).isEmpty();
    }

    // ── Anthropic ─────────────────────────────────────────────────────────────

    @Test
    void parseAnthropic_extractsBulletLines() {
        Map<?, ?> response = anthropicResponse("- Adopt ISO 50001.\n- Train staff on energy audits.");

        List<String> result = AiResponseParser.parseAnthropic(response);

        assertThat(result).hasSize(2);
        assertThat(result.get(0)).isEqualTo("Adopt ISO 50001.");
    }

    @Test
    void parseAnthropic_returnsEmptyOnNull() {
        assertThat(AiResponseParser.parseAnthropic(null)).isEmpty();
    }

    @Test
    void parseAnthropic_returnsEmptyOnMalformedResponse() {
        assertThat(AiResponseParser.parseAnthropic(Map.of("data", List.of()))).isEmpty();
    }

    // ── cross-parser: whitespace / mixed bullets ──────────────────────────────

    @Test
    void parseOpenAi_trimsWhitespaceAroundLines() {
        Map<?, ?> response = openAiResponse("  - Reduce emissions.  \n  - Improve governance.  ");

        List<String> result = AiResponseParser.parseOpenAi(response);

        assertThat(result).containsExactly("Reduce emissions.", "Improve governance.");
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private Map<?, ?> openAiResponse(String content) {
        return Map.of("choices", List.of(
                Map.of("message", Map.of("content", content))
        ));
    }

    private Map<?, ?> geminiResponse(String text) {
        return Map.of("candidates", List.of(
                Map.of("content", Map.of("parts", List.of(
                        Map.of("text", text)
                )))
        ));
    }

    private Map<?, ?> anthropicResponse(String text) {
        return Map.of("content", List.of(
                Map.of("text", text)
        ));
    }
}
