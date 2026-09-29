package com.sustainability.service;

import com.sustainability.entity.AppUser;
import com.sustainability.entity.CalculationHistory;
import com.sustainability.repository.CalculationHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class HistoryService {

    private final CalculationHistoryRepository historyRepository;
    private final ProfileService profileService;

    public HistoryService(CalculationHistoryRepository historyRepository, ProfileService profileService) {
        this.historyRepository = historyRepository;
        this.profileService = profileService;
    }

    @Transactional
    public void saveToHistory(AppUser user, double revenue, double costs, double investment,
                               double envScore, double socialScore) {
        var profile = profileService.getOrCreateProfile(user);

        CalculationHistory h = new CalculationHistory();
        h.setUser(user);
        h.setProfile(profile);
        h.setCarbonEmissions(profile.getCarbonScore());
        h.setEnergyConsumption(profile.getEnergyTotal());
        h.setWasteProduction(profile.getTotalWaste());
        h.setEevtaScore(profile.getEevtaScore());
        h.setRevenue(revenue);
        h.setCosts(costs);
        h.setInvestment(investment);
        h.setEnvironmentalScore(envScore);
        h.setSocialScore(socialScore);
        h.setSustainabilityScore(profile.getSustainabilityScore());
        h.setRoi(profile.getRoi());
        h.setCostBenefit(profile.getCostBenefit());
        historyRepository.save(h);

        // Prune to latest 20
        List<Long> allIds = historyRepository.findIdsByUserOrderByCreatedAtDesc(user);
        if (allIds.size() > 20) {
            List<Long> toDelete = allIds.subList(20, allIds.size());
            historyRepository.deleteByIdIn(toDelete);
        }
    }

    public Map<String, Object> getHistory(AppUser user) {
        List<CalculationHistory> histories = historyRepository.findByUserOrderByCreatedAtDesc(user);
        List<Map<String, Object>> list = new ArrayList<>();
        for (CalculationHistory h : histories) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("id", h.getId());
            entry.put("created_at", h.getCreatedAt() != null ? h.getCreatedAt().toString() : null);
            entry.put("updated_at", h.getUpdatedAt() != null ? h.getUpdatedAt().toString() : null);
            entry.put("carbon_emissions", h.getCarbonEmissions());
            entry.put("energy_consumption", h.getEnergyConsumption());
            entry.put("waste_production", h.getWasteProduction());
            entry.put("eevta_score", h.getEevtaScore());
            entry.put("revenue", h.getRevenue());
            entry.put("costs", h.getCosts());
            entry.put("investment", h.getInvestment());
            entry.put("environmental_score", h.getEnvironmentalScore());
            entry.put("social_score", h.getSocialScore());
            entry.put("sustainability_score", h.getSustainabilityScore());
            entry.put("roi", h.getRoi());
            entry.put("cost_benefit", h.getCostBenefit());
            list.add(entry);
        }
        return Map.of("histories", list);
    }
}
