package com.sustainability.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/result")
    public ResponseEntity<Map<String, List<String>>> result(@RequestBody AiRecommendationRequest req) {
        List<String> recs = aiService.getRecommendations(req);
        return ResponseEntity.ok(Map.of("recommendations", recs));
    }

    @PostMapping("/dashboard")
    public ResponseEntity<Map<String, List<String>>> dashboard(@RequestBody AiRecommendationRequest req) {
        req.setType("dashboard");
        List<String> recs = aiService.getRecommendations(req);
        return ResponseEntity.ok(Map.of("recommendations", recs));
    }
}
