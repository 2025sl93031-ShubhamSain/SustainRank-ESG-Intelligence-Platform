package com.sustainability.report;

import com.sustainability.ai.AiProvider;
import com.sustainability.ai.AiRecommendationRequest;
import com.sustainability.entity.SustainabilityProfile;
import com.sustainability.report.ReportAnalysisResult.MetricDiff;
import com.sustainability.repository.SustainabilityProfileRepository;
import com.sustainability.repository.UserRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);

    static final List<String> STANDARD_INDICATORS = List.of(
        "carbon_emissions_tco2e",
        "energy_consumption_kwh",
        "renewable_pct",
        "waste_tonnes",
        "recycling_rate_pct",
        "num_employees",
        "revenue",
        "water_consumption_kl",
        "scope1_emissions",
        "scope2_emissions",
        "scope3_emissions",
        "training_hours_per_employee",
        "gender_ratio_pct",
        "board_independence_pct",
        "energy_intensity"
    );

    private static final Map<String, Double> INDUSTRY_AVG = Map.ofEntries(
        Map.entry("carbon_emissions_tco2e",           5000.0),
        Map.entry("energy_consumption_kwh",          20000.0),
        Map.entry("renewable_pct",                      28.0),
        Map.entry("waste_tonnes",                      400.0),
        Map.entry("recycling_rate_pct",                 55.0),
        Map.entry("num_employees",                    1000.0),
        Map.entry("revenue",                      75000000.0),
        Map.entry("water_consumption_kl",            15000.0),
        Map.entry("scope1_emissions",                  800.0),
        Map.entry("scope2_emissions",                 3500.0),
        Map.entry("scope3_emissions",               12000.0),
        Map.entry("training_hours_per_employee",        40.0),
        Map.entry("gender_ratio_pct",                   35.0),
        Map.entry("board_independence_pct",             50.0),
        Map.entry("energy_intensity",                    0.8)
    );

    private static final Set<String> LOWER_IS_BETTER = Set.of(
        "carbon_emissions_tco2e", "waste_tonnes",
        "scope1_emissions", "scope2_emissions", "scope3_emissions", "energy_intensity"
    );

    private final AiProvider aiProvider;
    private final UserRepository userRepository;
    private final SustainabilityProfileRepository profileRepository;

    public ReportService(AiProvider aiProvider,
                         UserRepository userRepository,
                         SustainabilityProfileRepository profileRepository) {
        this.aiProvider = aiProvider;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public ReportAnalysisResult analyseReport(MultipartFile file, String username) throws IOException {
        String text = extractText(file);

        // AI is the primary extractor; regex fills any gaps AI missed or returned null for
        Map<String, Object> aiExtracted  = extractMetricsWithAi(text);
        Map<String, Object> regexExtracted = extractMetrics(text);
        Map<String, Object> extracted = mergeExtracted(aiExtracted, regexExtracted);

        Map<String, Object> manual   = getManualMetrics(username);
        List<MetricDiff>    diffs    = buildDiff(extracted, manual);
        List<String>        insights = getAiInsights(text, extracted, username);

        ReportAnalysisResult result = new ReportAnalysisResult();
        result.setExtractedMetrics(extracted);
        result.setManualMetrics(manual);
        result.setDifferences(diffs);
        result.setAiInsights(insights);
        result.setReportType(detectReportType(text));
        calculateCompleteness(result, extracted);
        result.setBenchmarks(buildBenchmarks(extracted));
        return result;
    }

    // AI-first extraction — asks the AI to return a JSON map of all 15 indicators
    private Map<String, Object> extractMetricsWithAi(String text) {
        try {
            String truncated = text.length() > 6000 ? text.substring(0, 6000) : text;
            AiRecommendationRequest req = new AiRecommendationRequest();
            req.setType("report_extraction");
            Map<String, Object> details = new LinkedHashMap<>();
            details.put("report_excerpt", truncated);
            req.setDetails(details);

            Map<String, Double> aiResult = aiProvider.extractMetrics(req);
            Map<String, Object> metrics = new LinkedHashMap<>();
            aiResult.forEach((k, v) -> {
                if (v != null && STANDARD_INDICATORS.contains(k)) {
                    metrics.put(k, v);
                }
            });
            log.info("AI extracted {} metrics from report", metrics.size());
            return metrics;
        } catch (Exception e) {
            log.warn("AI metric extraction failed, falling back to regex: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }

    // Merge: AI values take priority; regex fills keys not found by AI
    private Map<String, Object> mergeExtracted(Map<String, Object> ai, Map<String, Object> regex) {
        Map<String, Object> merged = new LinkedHashMap<>(ai);
        regex.forEach((k, v) -> merged.putIfAbsent(k, v));
        return merged;
    }

    private String extractText(MultipartFile file) throws IOException {
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(doc);
        }
    }

    private String detectReportType(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("brsr") || lower.contains("business responsibility")) return "BRSR";
        if (lower.contains("gri") || lower.contains("global reporting initiative")) return "GRI";
        if (lower.contains("sustainability report")) return "Sustainability Report";
        if (lower.contains("annual report")) return "Annual Report";
        return "ESG Report";
    }

    private Map<String, Object> extractMetrics(String text) {
        Map<String, Object> metrics = new LinkedHashMap<>();

        extractNumber(text, "(?i)(?:total\\s+)?(?:ghg|carbon|co2|greenhouse\\s+gas)\\s*(?:emission|footprint)?s?[^\\d]*(\\d[\\d,\\.]*)",
                "carbon_emissions_tco2e").ifPresent(v -> metrics.put("carbon_emissions_tco2e", v));

        extractNumber(text, "(?i)(?:total\\s+energy\\s+consumption\\s+was|energy\\s+consumption\\s+was|total\\s+energy\\s+consumption)[^\\d]*(\\d[\\d,\\.]*)",
                "energy_consumption_kwh").ifPresent(v -> metrics.put("energy_consumption_kwh", v));

        extractNumber(text, "(?i)renewable\\s+energy\\s+(?:accounts\\s+for|is|was|:)[^\\d]*(\\d[\\d,\\.]*)",
                "renewable_pct").ifPresent(v -> metrics.put("renewable_pct", v));

        extractNumber(text, "(?i)total\\s+waste\\s+generated[^\\d]*(\\d[\\d,\\.]*)",
                "waste_tonnes").ifPresent(v -> metrics.put("waste_tonnes", v));

        extractNumber(text, "(?i)waste\\s+(?:recycled|diverted)[^\\d]*(\\d[\\d,\\.]*)",
                "recycling_rate_pct").ifPresent(v -> metrics.put("recycling_rate_pct", v));

        extractNumber(text, "(?i)total\\s+employees?[^\\d]*(\\d[\\d,\\.]*)",
                "num_employees").ifPresent(v -> metrics.put("num_employees", v));

        extractNumber(text, "(?i)total\\s+revenue[^\\d]*(\\d[\\d,\\.]*)",
                "revenue").ifPresent(v -> metrics.put("revenue", v));

        return metrics;
    }

    private Optional<Double> extractNumber(String text, String pattern, String label) {
        try {
            Matcher m = Pattern.compile(pattern).matcher(text);
            if (m.find()) {
                String raw = m.group(1).replaceAll(",", "");
                return Optional.of(Double.parseDouble(raw));
            }
        } catch (Exception e) {
            log.debug("Could not extract {}: {}", label, e.getMessage());
        }
        return Optional.empty();
    }

    private Map<String, Object> getManualMetrics(String username) {
        return userRepository.findByUsername(username)
                .flatMap(u -> profileRepository.findByUser(u))
                .map(p -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    if (p.getCarbonScore() != 0)        m.put("carbon_score", p.getCarbonScore());
                    if (p.getEnergyTotal() != 0)        m.put("energy_consumption_kwh", p.getEnergyTotal());
                    if (p.getRenewablePct() != 0)       m.put("renewable_pct", p.getRenewablePct());
                    if (p.getTotalWaste() != 0)         m.put("waste_tonnes", p.getTotalWaste());
                    if (p.getWasteDiversionRate() != 0) m.put("recycling_rate_pct", p.getWasteDiversionRate());
                    if (p.getNumEmployees() != 0)       m.put("num_employees", p.getNumEmployees());
                    return m;
                })
                .orElse(Collections.emptyMap());
    }

    private List<MetricDiff> buildDiff(Map<String, Object> extracted, Map<String, Object> manual) {
        List<MetricDiff> diffs = new ArrayList<>();
        Set<String> allKeys = new LinkedHashSet<>();
        allKeys.addAll(extracted.keySet());
        allKeys.addAll(manual.keySet());

        for (String key : allKeys) {
            Object ext = extracted.get(key);
            Object man = manual.get(key);
            String status;
            if (ext == null) {
                status = "missing";
            } else if (man == null) {
                status = "extracted_only";
            } else {
                double extVal = ((Number) ext).doubleValue();
                double manVal = ((Number) man).doubleValue();
                double pctDiff = manVal != 0 ? Math.abs(extVal - manVal) / manVal * 100 : 100;
                status = pctDiff < 10 ? "match" : "mismatch";
            }
            diffs.add(new MetricDiff(key, ext, man, status));
        }
        return diffs;
    }

    private void calculateCompleteness(ReportAnalysisResult result, Map<String, Object> extracted) {
        List<String> found   = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        for (String indicator : STANDARD_INDICATORS) {
            if (extracted.containsKey(indicator)) {
                found.add(indicator);
            } else {
                missing.add(indicator);
            }
        }
        int score = (int) Math.round(found.size() * 100.0 / STANDARD_INDICATORS.size());
        result.setFoundIndicators(found);
        result.setMissingIndicators(missing);
        result.setCompletenessScore(score);
    }

    private Map<String, ReportAnalysisResult.BenchmarkResult> buildBenchmarks(Map<String, Object> extracted) {
        Map<String, ReportAnalysisResult.BenchmarkResult> benchmarks = new LinkedHashMap<>();

        for (Map.Entry<String, Object> entry : extracted.entrySet()) {
            String key = entry.getKey();
            Double avg = INDUSTRY_AVG.get(key);
            if (avg == null || avg == 0) continue;

            double value = ((Number) entry.getValue()).doubleValue();
            double ratio = value / avg;

            String rawStatus;
            if (ratio < 0.9)      rawStatus = "below";
            else if (ratio > 1.1) rawStatus = "above";
            else                  rawStatus = "on_par";

            String status;
            if (LOWER_IS_BETTER.contains(key)) {
                status = rawStatus.equals("above") ? "below"
                       : rawStatus.equals("below") ? "above"
                       : "on_par";
            } else {
                status = rawStatus;
            }

            double goodRatio = LOWER_IS_BETTER.contains(key) ? (1.0 / ratio) : ratio;
            String percentile;
            if      (goodRatio >= 1.5)  percentile = "Top 10%";
            else if (goodRatio >= 1.2)  percentile = "Top 25%";
            else if (goodRatio >= 0.95) percentile = "Mid 50%";
            else if (goodRatio >= 0.75) percentile = "Bottom 25%";
            else                        percentile = "Bottom 10%";

            benchmarks.put(key, new ReportAnalysisResult.BenchmarkResult(
                avg, status, percentile, "IT / Tech Sector"
            ));
        }
        return benchmarks;
    }

    private List<String> getAiInsights(String text, Map<String, Object> extracted, String username) {
        try {
            String truncated = text.length() > 4000 ? text.substring(0, 4000) : text;
            AiRecommendationRequest req = new AiRecommendationRequest();
            req.setType("report_analysis");
            req.setIndustry("general");

            Map<String, Object> details = new LinkedHashMap<>(extracted);
            details.put("report_excerpt", truncated);
            req.setDetails(details);

            return aiProvider.getRecommendations(req);
        } catch (Exception e) {
            log.warn("AI insights failed for report analysis: {} — {}", e.getClass().getSimpleName(), e.getMessage());
            return Collections.emptyList();
        }
    }
}
