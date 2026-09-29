package com.sustainability.service;

import com.sustainability.entity.AppUser;
import com.sustainability.entity.SustainabilityProfile;
import com.sustainability.repository.CalculationHistoryRepository;
import com.sustainability.repository.SustainabilityProfileRepository;
import com.sustainability.util.CalcUtils;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.sustainability.util.CalcUtils.*;

@Service
public class DashboardService {

    private final ProfileService profileService;
    private final SustainabilityProfileRepository profileRepository;
    private final CalculationHistoryRepository historyRepository;

    public DashboardService(ProfileService profileService,
                             SustainabilityProfileRepository profileRepository,
                             CalculationHistoryRepository historyRepository) {
        this.profileService = profileService;
        this.profileRepository = profileRepository;
        this.historyRepository = historyRepository;
    }

    public Map<String, Object> getDashboard(AppUser user) {
        SustainabilityProfile yourProfile = profileService.getOrCreateProfile(user);

        // Your company data
        Map<String, Object> yourCompanyData = buildCompanyMap(yourProfile);

        // Rankings (4 sort orders)
        List<SustainabilityProfile> byScore     = profileRepository.findAllByOrderBySustainabilityScoreDesc();
        List<SustainabilityProfile> byRoi       = profileRepository.findAllByOrderByRoiDesc();
        List<SustainabilityProfile> byCb        = profileRepository.findAllByOrderByCostBenefitDesc();
        List<SustainabilityProfile> byComposite = profileRepository.findAllOrderByCompositeScoreDesc();

        Map<String, List<Map<String, Object>>> sortedData = new LinkedHashMap<>();
        sortedData.put("sustainability_score", toRankingList(byScore));
        sortedData.put("roi",                  toRankingList(byRoi));
        sortedData.put("cost_benefit",         toRankingList(byCb));
        sortedData.put("composite_score",      toCompositeRankingList(byComposite));

        // My rank
        Map<String, Object> myRank = new LinkedHashMap<>();
        myRank.put("sustainability_score", findRank(byScore, yourProfile.getId()));
        myRank.put("roi",                  findRank(byRoi, yourProfile.getId()));
        myRank.put("cost_benefit",         findRank(byCb, yourProfile.getId()));
        myRank.put("composite_score",      findRank(byComposite, yourProfile.getId()));

        // Industry stats
        Map<String, Object> industryStats = new LinkedHashMap<>();
        industryStats.put("avg_roi",             nullSafe(profileRepository.findAvgRoi()));
        industryStats.put("avg_sustainability",   nullSafe(profileRepository.findAvgSustainabilityScore()));
        industryStats.put("avg_carbon",           nullSafe(profileRepository.findAvgCarbonScore()));
        industryStats.put("avg_energy",           nullSafe(profileRepository.findAvgEnergyTotal()));
        industryStats.put("avg_waste",            nullSafe(profileRepository.findAvgTotalWaste()));
        industryStats.put("avg_env",              nullSafe(profileRepository.findAvgEnvironmentalScore()));
        industryStats.put("avg_social",           nullSafe(profileRepository.findAvgSocialScore()));
        industryStats.put("max_sustainability",   nullSafe(profileRepository.findMaxSustainabilityScore()));
        industryStats.put("min_sustainability",   nullSafe(profileRepository.findMinSustainabilityScore()));

        // Radar data
        List<String> radarLabels = List.of("Carbon", "Energy", "Waste", "Social", "ROI", "Cost-Benefit");
        List<Object> radarYourData = buildRadarData(yourProfile);
        List<Integer> radarIndustryData = List.of(50, 50, 50, 50, 50, 50);

        // Change calculations (vs oldest history entry)
        double roiChange = 0, susChange = 0, costChange = 0, energyChange = 0, wasteChange = 0;
        var firstHistory = historyRepository.findFirstByUserOrderByCreatedAtAsc(user);
        if (firstHistory.isPresent()) {
            var last = firstHistory.get();
            roiChange    = round(yourProfile.getRoi()                - last.getRoi(), 1);
            susChange    = round(yourProfile.getSustainabilityScore()- last.getSustainabilityScore(), 1);
            costChange   = round(yourProfile.getCostBenefit()        - last.getCostBenefit(), 1);
        }

        String lastUpdate = null;
        if (firstHistory.isPresent() && firstHistory.get().getUpdatedAt() != null) {
            lastUpdate = firstHistory.get().getUpdatedAt().toString();
        }

        Map<String, Object> ctx = new LinkedHashMap<>();
        ctx.put("your_company",         yourCompanyData);
        ctx.put("industry_stats",       industryStats);
        ctx.put("radar_labels",         radarLabels);
        ctx.put("radar_your_data",      radarYourData);
        ctx.put("radar_industry_data",  radarIndustryData);
        ctx.put("sorted_data",          sortedData);
        ctx.put("my_rank",              myRank);
        ctx.put("roi_change",           roiChange);
        ctx.put("sus_change",           susChange);
        ctx.put("cost_change",          costChange);
        ctx.put("energy_change",        energyChange);
        ctx.put("waste_change",         wasteChange);
        ctx.put("last_update",          lastUpdate);
        return ctx;
    }

    private Map<String, Object> buildCompanyMap(SustainabilityProfile p) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id_value",             String.valueOf(p.getUser().getUsername()));
        m.put("company_name",         p.getCompanyName());
        m.put("roi",                  p.getRoi());
        m.put("sustainability_score", p.getSustainabilityScore());
        m.put("environmental_score",  p.getEnvironmentalScore());
        m.put("social_score",         p.getSocialScore());
        m.put("cost_benefit",         p.getCostBenefit());
        m.put("carbon_score",         p.getCarbonScore());
        m.put("carbon_intensity",     p.getCarbonIntensity());
        m.put("electricity_usage",    p.getElectricityUsage());
        m.put("waste_reduction_rate", p.getWasteReductionRate());
        m.put("renewable_pct",        p.getRenewablePct());
        return m;
    }

    private List<Map<String, Object>> toRankingList(List<SustainabilityProfile> profiles) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (SustainabilityProfile p : profiles) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id",                   p.getId());
            m.put("company_name",         p.getCompanyName());
            m.put("user__username",       p.getUser().getUsername());
            m.put("roi",                  p.getRoi());
            m.put("sustainability_score", p.getSustainabilityScore());
            m.put("cost_benefit",         p.getCostBenefit());
            m.put("carbon_score",         p.getCarbonScore());
            m.put("industry",             p.getIndustry());
            m.put("eevta_score",          p.getEevtaScore());
            m.put("environmental_score",  p.getEnvironmentalScore());
            m.put("social_score",         p.getSocialScore());
            list.add(m);
        }
        return list;
    }

    private List<Map<String, Object>> toCompositeRankingList(List<SustainabilityProfile> profiles) {
        List<Map<String, Object>> list = toRankingList(profiles);
        for (Map<String, Object> m : list) {
            double ss  = (Double) m.get("sustainability_score");
            double roi = (Double) m.get("roi");
            double cb  = (Double) m.get("cost_benefit");
            m.put("composite_score", round(ss * 0.50 + roi * 0.30 + cb * 0.20, 4));
        }
        return list;
    }

    private int findRank(List<SustainabilityProfile> sorted, Long id) {
        for (int i = 0; i < sorted.size(); i++) {
            if (sorted.get(i).getId().equals(id)) return i + 1;
        }
        return 0;
    }

    private List<Object> buildRadarData(SustainabilityProfile p) {
        String sector = sectorKey(p.getIndustry());
        return List.of(
            (long) Math.round(percentileScore(p.getCarbonIntensity(), SECTOR_CARBON.get(sector), true)),
            (long) Math.round(percentileScore(p.getEnergyIntensity(),  SECTOR_ENERGY.get(sector), true)),
            (long) Math.round(p.getWasteReductionRate()),
            (long) Math.round(p.getEevtaScore()),
            (long) Math.round(clamp(p.getRoi(), 0, 100)),
            (long) Math.round(clamp(p.getCostBenefit() * 10, 0, 100))
        );
    }

    private double nullSafe(Double val) {
        return val != null ? val : 0.0;
    }
}
