package com.sustainability.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final AiProvider provider;

    public AiService(AiProvider provider) {
        this.provider = provider;
    }

    public List<String> getRecommendations(AiRecommendationRequest request) {
        try {
            List<String> recs = provider.getRecommendations(request);
            return recs == null || recs.isEmpty() ? Collections.emptyList() : recs;
        } catch (Exception e) {
            log.error("AI recommendation call failed: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
