package com.sustainability.ai;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public interface AiProvider {
    List<String> getRecommendations(AiRecommendationRequest request);

    default Map<String, Double> extractMetrics(AiRecommendationRequest request) {
        return Collections.emptyMap();
    }
}
