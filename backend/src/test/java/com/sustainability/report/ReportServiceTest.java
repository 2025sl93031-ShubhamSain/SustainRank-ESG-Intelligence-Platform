package com.sustainability.report;

import com.sustainability.ai.AiProvider;
import com.sustainability.repository.SustainabilityProfileRepository;
import com.sustainability.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock AiProvider aiProvider;
    @Mock UserRepository userRepository;
    @Mock SustainabilityProfileRepository profileRepository;
    @InjectMocks ReportService service;

    // ── detectReportType ────────────────────────────────────────────

    @Test
    void detectReportType_brsr() {
        assertThat(invokeDetect("This is a BRSR report for FY2025")).isEqualTo("BRSR");
    }

    @Test
    void detectReportType_gri() {
        assertThat(invokeDetect("Prepared under GRI standards")).isEqualTo("GRI");
    }

    @Test
    void detectReportType_sustainabilityReport() {
        assertThat(invokeDetect("Annual sustainability report 2025")).isEqualTo("Sustainability Report");
    }

    @Test
    void detectReportType_annualReport() {
        assertThat(invokeDetect("Annual report and accounts")).isEqualTo("Annual Report");
    }

    @Test
    void detectReportType_fallback() {
        assertThat(invokeDetect("Some random document with no keywords")).isEqualTo("ESG Report");
    }

    // ── STANDARD_INDICATORS ────────────────────────────────────────

    @Test
    void standardIndicators_hasExactly15() {
        assertThat(ReportService.STANDARD_INDICATORS).hasSize(15);
    }

    @Test
    void standardIndicators_containsAllExpected() {
        assertThat(ReportService.STANDARD_INDICATORS).contains(
            "carbon_emissions_tco2e", "energy_consumption_kwh", "renewable_pct",
            "waste_tonnes", "recycling_rate_pct", "num_employees", "revenue",
            "water_consumption_kl", "scope1_emissions", "scope2_emissions",
            "scope3_emissions", "training_hours_per_employee", "gender_ratio_pct",
            "board_independence_pct", "energy_intensity"
        );
    }

    // ── calculateCompleteness ──────────────────────────────────────

    @Test
    void completeness_allExtracted_gives100() {
        Map<String, Object> extracted = buildAllIndicators();
        ReportAnalysisResult result = new ReportAnalysisResult();
        invokeCompleteness(result, extracted);

        assertThat(result.getCompletenessScore()).isEqualTo(100);
        assertThat(result.getFoundIndicators()).hasSize(15);
        assertThat(result.getMissingIndicators()).isEmpty();
    }

    @Test
    void completeness_noneExtracted_gives0() {
        ReportAnalysisResult result = new ReportAnalysisResult();
        invokeCompleteness(result, Map.of());

        assertThat(result.getCompletenessScore()).isEqualTo(0);
        assertThat(result.getFoundIndicators()).isEmpty();
        assertThat(result.getMissingIndicators()).hasSize(15);
    }

    @Test
    void completeness_sevenExtracted_gives47() {
        Map<String, Object> extracted = Map.of(
            "carbon_emissions_tco2e", 4250.0,
            "energy_consumption_kwh", 18500.0,
            "renewable_pct", 42.0,
            "waste_tonnes", 320.0,
            "recycling_rate_pct", 68.0,
            "num_employees", 1200.0,
            "revenue", 85000000.0
        );
        ReportAnalysisResult result = new ReportAnalysisResult();
        invokeCompleteness(result, extracted);

        assertThat(result.getCompletenessScore()).isEqualTo(47);
        assertThat(result.getFoundIndicators()).hasSize(7);
        assertThat(result.getMissingIndicators()).hasSize(8);
    }

    @Test
    void completeness_missingIndicators_doNotContainFoundOnes() {
        Map<String, Object> extracted = Map.of("carbon_emissions_tco2e", 4250.0);
        ReportAnalysisResult result = new ReportAnalysisResult();
        invokeCompleteness(result, extracted);

        assertThat(result.getFoundIndicators()).contains("carbon_emissions_tco2e");
        assertThat(result.getMissingIndicators()).doesNotContain("carbon_emissions_tco2e");
    }

    // ── buildBenchmarks ────────────────────────────────────────────

    @Test
    void benchmark_renewablePct_aboveAvg_isAbove() {
        // avg = 28, value = 42 → higher is better → "above"
        Map<String, Object> extracted = Map.of("renewable_pct", 42.0);
        Map<String, ReportAnalysisResult.BenchmarkResult> bm = invokeBenchmarks(extracted);

        assertThat(bm).containsKey("renewable_pct");
        assertThat(bm.get("renewable_pct").getStatus()).isEqualTo("above");
    }

    @Test
    void benchmark_carbonEmissions_lowerThanAvg_isAbove() {
        // avg = 5000, value = 4250 → lower is better → performing "above" average
        Map<String, Object> extracted = Map.of("carbon_emissions_tco2e", 4250.0);
        Map<String, ReportAnalysisResult.BenchmarkResult> bm = invokeBenchmarks(extracted);

        assertThat(bm.get("carbon_emissions_tco2e").getStatus()).isEqualTo("above");
    }

    @Test
    void benchmark_carbonEmissions_higherThanAvg_isBelow() {
        // value = 8000 > avg 5000 → lower is better → performing "below" average
        Map<String, Object> extracted = Map.of("carbon_emissions_tco2e", 8000.0);
        Map<String, ReportAnalysisResult.BenchmarkResult> bm = invokeBenchmarks(extracted);

        assertThat(bm.get("carbon_emissions_tco2e").getStatus()).isEqualTo("below");
    }

    @Test
    void benchmark_onPar_withinTenPct() {
        // avg = 28, value = 29 → ~3.5% diff → "on_par"
        Map<String, Object> extracted = Map.of("renewable_pct", 29.0);
        Map<String, ReportAnalysisResult.BenchmarkResult> bm = invokeBenchmarks(extracted);

        assertThat(bm.get("renewable_pct").getStatus()).isEqualTo("on_par");
    }

    @Test
    void benchmark_percentile_top25() {
        // renewable avg=28, value=35 → ratio=1.25 → Top 25%
        Map<String, Object> extracted = Map.of("renewable_pct", 35.0);
        Map<String, ReportAnalysisResult.BenchmarkResult> bm = invokeBenchmarks(extracted);

        assertThat(bm.get("renewable_pct").getPercentile()).isEqualTo("Top 25%");
    }

    @Test
    void benchmark_industryLabel_isItTechSector() {
        Map<String, Object> extracted = Map.of("renewable_pct", 42.0);
        Map<String, ReportAnalysisResult.BenchmarkResult> bm = invokeBenchmarks(extracted);

        assertThat(bm.get("renewable_pct").getIndustry()).isEqualTo("IT / Tech Sector");
    }

    @Test
    void benchmark_unknownMetric_isSkipped() {
        Map<String, Object> extracted = Map.of("unknown_metric", 999.0);
        Map<String, ReportAnalysisResult.BenchmarkResult> bm = invokeBenchmarks(extracted);

        assertThat(bm).doesNotContainKey("unknown_metric");
    }

    @Test
    void benchmark_industryAvg_isCorrect() {
        Map<String, Object> extracted = Map.of("renewable_pct", 42.0);
        Map<String, ReportAnalysisResult.BenchmarkResult> bm = invokeBenchmarks(extracted);

        assertThat(bm.get("renewable_pct").getIndustryAvg()).isEqualTo(28.0);
    }

    // ── analyseReport (integration with mocked AI + empty profile) ──

    @Test
    void analyseReport_emptyProfile_returnsExtractedOnly() throws Exception {
        when(userRepository.findByUsername(any())).thenReturn(Optional.empty());
        when(aiProvider.getRecommendations(any())).thenReturn(List.of());

        String pdfText = buildMinimalPdfText();
        MockMultipartFile file = new MockMultipartFile(
            "file", "test.pdf", "application/pdf", buildMinimalPdf(pdfText)
        );

        ReportAnalysisResult result = service.analyseReport(file, "testuser");

        assertThat(result.getExtractedMetrics()).isNotNull();
        assertThat(result.getCompletenessScore()).isGreaterThanOrEqualTo(0);
        assertThat(result.getBenchmarks()).isNotNull();
        assertThat(result.getFoundIndicators()).isNotNull();
        assertThat(result.getMissingIndicators()).isNotNull();
        assertThat(result.getFoundIndicators().size() + result.getMissingIndicators().size())
            .isEqualTo(15);
    }

    // ── Helpers ────────────────────────────────────────────────────

    private String invokeDetect(String text) {
        try {
            var m = ReportService.class.getDeclaredMethod("detectReportType", String.class);
            m.setAccessible(true);
            return (String) m.invoke(service, text);
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    @SuppressWarnings("unchecked")
    private void invokeCompleteness(ReportAnalysisResult result, Map<String, Object> extracted) {
        try {
            var m = ReportService.class.getDeclaredMethod("calculateCompleteness",
                ReportAnalysisResult.class, Map.class);
            m.setAccessible(true);
            m.invoke(service, result, extracted);
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    @SuppressWarnings("unchecked")
    private Map<String, ReportAnalysisResult.BenchmarkResult> invokeBenchmarks(Map<String, Object> extracted) {
        try {
            var m = ReportService.class.getDeclaredMethod("buildBenchmarks", Map.class);
            m.setAccessible(true);
            return (Map<String, ReportAnalysisResult.BenchmarkResult>) m.invoke(service, extracted);
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    private Map<String, Object> buildAllIndicators() {
        return Map.ofEntries(
            Map.entry("carbon_emissions_tco2e", 4250.0),
            Map.entry("energy_consumption_kwh", 18500.0),
            Map.entry("renewable_pct", 42.0),
            Map.entry("waste_tonnes", 320.0),
            Map.entry("recycling_rate_pct", 68.0),
            Map.entry("num_employees", 1200.0),
            Map.entry("revenue", 85000000.0),
            Map.entry("water_consumption_kl", 12000.0),
            Map.entry("scope1_emissions", 600.0),
            Map.entry("scope2_emissions", 3200.0),
            Map.entry("scope3_emissions", 10000.0),
            Map.entry("training_hours_per_employee", 48.0),
            Map.entry("gender_ratio_pct", 32.0),
            Map.entry("board_independence_pct", 56.0),
            Map.entry("energy_intensity", 0.7)
        );
    }

    private String buildMinimalPdfText() {
        return "Total GHG carbon emissions 4250 tCO2e. Total energy consumption was 18500 kWh. " +
               "Renewable energy accounts for 42% of energy mix. Total waste generated 320 tonnes. " +
               "Total employees 1200.";
    }

    private byte[] buildMinimalPdf(String text) throws Exception {
        try (org.apache.pdfbox.pdmodel.PDDocument doc = new org.apache.pdfbox.pdmodel.PDDocument()) {
            org.apache.pdfbox.pdmodel.PDPage page = new org.apache.pdfbox.pdmodel.PDPage();
            doc.addPage(page);
            var font = new org.apache.pdfbox.pdmodel.font.PDType1Font(
                org.apache.pdfbox.pdmodel.font.Standard14Fonts.FontName.HELVETICA);
            try (org.apache.pdfbox.pdmodel.PDPageContentStream cs =
                     new org.apache.pdfbox.pdmodel.PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(font, 10);
                cs.newLineAtOffset(50, 700);
                cs.showText(text.substring(0, Math.min(text.length(), 200)));
                cs.endText();
            }
            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        }
    }
}
