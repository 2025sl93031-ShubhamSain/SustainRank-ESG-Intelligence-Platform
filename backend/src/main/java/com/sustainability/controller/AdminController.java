package com.sustainability.controller;

import com.sustainability.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final LeaderboardService leaderboardService;

    public AdminController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/leaderboard/")
    public ResponseEntity<List<Map<String, Object>>> leaderboard() {
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }
}
