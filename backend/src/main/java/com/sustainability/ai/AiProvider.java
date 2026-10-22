package com.sustainability.ai;

import java.util.List;

public interface AiProvider {
    List<String> getRecommendations(AiRecommendationRequest request);
}
