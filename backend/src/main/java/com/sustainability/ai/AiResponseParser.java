package com.sustainability.ai;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AiResponseParser {

    private static final ObjectMapper MAPPER = new ObjectMapper();

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
    public static Map<String, Double> parseJsonOpenAi(Map<?, ?> response) {
        try {
            var choices = (List<Map<?, ?>>) response.get("choices");
            var message = (Map<?, ?>) choices.get(0).get("message");
            String content = (String) message.get("content");
            return parseJsonContent(content);
        } catch (Exception e) {
            return Collections.emptyMap();
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
    public static Map<String, Double> parseJsonGemini(Map<?, ?> response) {
        try {
            var candidates = (List<Map<?, ?>>) response.get("candidates");
            var content = (Map<?, ?>) candidates.get(0).get("content");
            var parts = (List<Map<?, ?>>) content.get("parts");
            String text = (String) parts.get(0).get("text");
            return parseJsonContent(text);
        } catch (Exception e) {
            return Collections.emptyMap();
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

    @SuppressWarnings("unchecked")
    public static Map<String, Double> parseJsonAnthropic(Map<?, ?> response) {
        try {
            var contentList = (List<Map<?, ?>>) response.get("content");
            String text = (String) contentList.get(0).get("text");
            return parseJsonContent(text);
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Double> parseJsonContent(String text) {
        if (text == null || text.isBlank()) return Collections.emptyMap();
        try {
            // strip markdown code fences if present
            String json = text.trim();
            if (json.startsWith("```")) {
                json = json.replaceAll("^```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
            }
            // find the first { ... } block
            int start = json.indexOf('{');
            int end   = json.lastIndexOf('}');
            if (start == -1 || end == -1) return Collections.emptyMap();
            json = json.substring(start, end + 1);

            Map<String, Object> raw = MAPPER.readValue(json, Map.class);
            Map<String, Double> result = new LinkedHashMap<>();
            for (Map.Entry<String, Object> entry : raw.entrySet()) {
                if (entry.getValue() == null) continue;
                try {
                    result.put(entry.getKey(), ((Number) entry.getValue()).doubleValue());
                } catch (ClassCastException ignored) {}
            }
            return result;
        } catch (Exception e) {
            return Collections.emptyMap();
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
