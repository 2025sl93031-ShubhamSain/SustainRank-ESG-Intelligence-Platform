package com.sustainability.report;

import java.util.List;
import java.util.Map;

public class ReportAnalysisResult {

    private Map<String, Object> extractedMetrics;
    private Map<String, Object> manualMetrics;
    private List<MetricDiff> differences;
    private List<String> aiInsights;
    private String reportType;
    private int completenessScore;
    private List<String> foundIndicators;
    private List<String> missingIndicators;
    private Map<String, BenchmarkResult> benchmarks;

    public static class MetricDiff {
        private String field;
        private Object extracted;
        private Object manual;
        private String status;

        public MetricDiff(String field, Object extracted, Object manual, String status) {
            this.field = field;
            this.extracted = extracted;
            this.manual = manual;
            this.status = status;
        }

        public String getField() { return field; }
        public Object getExtracted() { return extracted; }
        public Object getManual() { return manual; }
        public String getStatus() { return status; }
    }

    public static class BenchmarkResult {
        private double industryAvg;
        private String status;
        private String percentile;
        private String industry;

        public BenchmarkResult(double industryAvg, String status, String percentile, String industry) {
            this.industryAvg = industryAvg;
            this.status      = status;
            this.percentile  = percentile;
            this.industry    = industry;
        }

        public double getIndustryAvg() { return industryAvg; }
        public String getStatus()      { return status; }
        public String getPercentile()  { return percentile; }
        public String getIndustry()    { return industry; }
    }

    public Map<String, Object> getExtractedMetrics() { return extractedMetrics; }
    public void setExtractedMetrics(Map<String, Object> v) { this.extractedMetrics = v; }

    public Map<String, Object> getManualMetrics() { return manualMetrics; }
    public void setManualMetrics(Map<String, Object> v) { this.manualMetrics = v; }

    public List<MetricDiff> getDifferences() { return differences; }
    public void setDifferences(List<MetricDiff> v) { this.differences = v; }

    public List<String> getAiInsights() { return aiInsights; }
    public void setAiInsights(List<String> v) { this.aiInsights = v; }

    public String getReportType() { return reportType; }
    public void setReportType(String v) { this.reportType = v; }

    public int getCompletenessScore() { return completenessScore; }
    public void setCompletenessScore(int v) { this.completenessScore = v; }

    public List<String> getFoundIndicators() { return foundIndicators; }
    public void setFoundIndicators(List<String> v) { this.foundIndicators = v; }

    public List<String> getMissingIndicators() { return missingIndicators; }
    public void setMissingIndicators(List<String> v) { this.missingIndicators = v; }

    public Map<String, BenchmarkResult> getBenchmarks() { return benchmarks; }
    public void setBenchmarks(Map<String, BenchmarkResult> v) { this.benchmarks = v; }
}
