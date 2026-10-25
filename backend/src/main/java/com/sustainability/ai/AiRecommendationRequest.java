package com.sustainability.ai;

import java.util.Map;

public class AiRecommendationRequest {

    private String type;
    private Double score;
    private String industry;
    private Map<String, Object> details;

    // dashboard fields
    private Integer rank;
    private Integer totalCompanies;
    private Double sustainabilityScore;
    private Double environmentalScore;
    private Double socialScore;
    private Double governanceScore;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }

    public Integer getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(Integer totalCompanies) { this.totalCompanies = totalCompanies; }

    public Double getSustainabilityScore() { return sustainabilityScore; }
    public void setSustainabilityScore(Double sustainabilityScore) { this.sustainabilityScore = sustainabilityScore; }

    public Double getEnvironmentalScore() { return environmentalScore; }
    public void setEnvironmentalScore(Double environmentalScore) { this.environmentalScore = environmentalScore; }

    public Double getSocialScore() { return socialScore; }
    public void setSocialScore(Double socialScore) { this.socialScore = socialScore; }

    public Double getGovernanceScore() { return governanceScore; }
    public void setGovernanceScore(Double governanceScore) { this.governanceScore = governanceScore; }
}
