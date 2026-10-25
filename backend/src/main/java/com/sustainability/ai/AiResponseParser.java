package com.sustainability.ai;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AiResponseParser {

    @SuppressWarnings("unchecked")
    public static List<String> parseOpenAi(Map<?, ?> response) {
        try {
            var choices = (List<Map<?, ?>>) response.get("choices");
            var message = (Map<?, ?>) choices.get(0).get("message");
            String content = (String) message.get("content");
            return parseLines(content);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @SuppressWarnings("unchecked")
    public static List<String> parseGemini(Map<?, ?> response) {
        try {
            var candidates = (List<Map<?, ?>>) response.get("candidates");
            var content = (Map<?, ?>) candidates.get(0).get("content");
            var parts = (List<Map<?, ?>>) content.get("parts");
            String text = (String) parts.get(0).get("text");
            return parseLines(text);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @SuppressWarnings("unchecked")
    public static List<String> parseAnthropic(Map<?, ?> response) {
        try {
            var contentList = (List<Map<?, ?>>) response.get("content");
            String text = (String) contentList.get(0).get("text");
            return parseLines(text);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private static List<String> parseLines(String text) {
        if (text == null || text.isBlank()) return Collections.emptyList();
        return Arrays.stream(text.split("\n"))
                .map(String::trim)
                .filter(l -> !l.isBlank())
                .map(l -> l.replaceFirst("^[-•*]\\s*", ""))
                .filter(l -> !l.isBlank())
                .collect(Collectors.toList());
    }
}
