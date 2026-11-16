package com.sustainability.service;

import com.sustainability.entity.AppUser;
import com.sustainability.entity.CalculationHistory;
import com.sustainability.repository.CalculationHistoryRepository;
import com.sustainability.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class LeaderboardService {

    private final UserRepository userRepository;
    private final CalculationHistoryRepository historyRepository;

    public LeaderboardService(UserRepository userRepository,
                              CalculationHistoryRepository historyRepository) {
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
    }

    public List<Map<String, Object>> getLeaderboard() {
        List<AppUser> users = userRepository.findAll();

        List<Map<String, Object>> rows = new ArrayList<>();

        for (AppUser user : users) {
            List<CalculationHistory> history =
                historyRepository.findByUserOrderByCreatedAtDesc(user);
            if (history.isEmpty()) continue;

            CalculationHistory latest = history.get(0);

            double trendScore = 0;
            String trend = "neutral";
            if (history.size() >= 2) {
                double prev = history.get(1).getSustainabilityScore();
                double curr = latest.getSustainabilityScore();
                trendScore = Math.round((curr - prev) * 10.0) / 10.0;
                trend = trendScore > 0 ? "up" : trendScore < 0 ? "down" : "neutral";
            }

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("username", user.getUsername());
            row.put("sustainability_score", latest.getSustainabilityScore());
            row.put("carbon_emissions", latest.getCarbonEmissions());
            row.put("energy_consumption", latest.getEnergyConsumption());
            row.put("waste_production", latest.getWasteProduction());
            row.put("roi", latest.getRoi());
            row.put("environmental_score", latest.getEnvironmentalScore());
            row.put("social_score", latest.getSocialScore());
            row.put("trend", trend);
            row.put("trend_score", trendScore);
            row.put("last_updated", latest.getCreatedAt());
            rows.add(row);
        }

        rows.sort((a, b) -> Double.compare(
            (double) b.get("sustainability_score"),
            (double) a.get("sustainability_score")
        ));

        for (int i = 0; i < rows.size(); i++) {
            rows.get(i).put("rank", i + 1);
        }

        return rows;
    }
}
