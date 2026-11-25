package com.sustainability.controller;

import com.sustainability.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AdminController {

    private final LeaderboardService leaderboardService;

    public AdminController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    // Admin only — full data (carbon, energy, waste, ROI, E/S scores)
    @GetMapping("/api/admin/leaderboard/")
    public ResponseEntity<List<Map<String, Object>>> adminLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }

    // All authenticated users — rank, username, score, trend only
    @GetMapping("/api/leaderboard/")
    public ResponseEntity<List<Map<String, Object>>> publicLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getPublicLeaderboard());
    }
}
