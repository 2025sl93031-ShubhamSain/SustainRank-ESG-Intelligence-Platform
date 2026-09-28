package com.sustainability.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "calculation_history",
       indexes = @Index(name = "idx_history_user_created", columnList = "user_id, created_at DESC"))
public class CalculationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private SustainabilityProfile profile;

    @Column(name = "carbon_emissions") private double carbonEmissions;
    @Column(name = "energy_consumption") private double energyConsumption;
    @Column(name = "waste_production") private double wasteProduction;
    @Column(name = "eevta_score") private double eevtaScore;
    private double revenue = 0;
    private double costs = 0;
    private double investment = 0;

    @Column(name = "environmental_score") private double environmentalScore = 0;
    @Column(name = "social_score") private double socialScore = 0;
    @Column(name = "sustainability_score") private double sustainabilityScore;
    private double roi;
    @Column(name = "cost_benefit") private double costBenefit;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CalculationHistory() {}

    public Long getId() { return id; }
    public AppUser getUser() { return user; }
    public void setUser(AppUser user) { this.user = user; }
    public SustainabilityProfile getProfile() { return profile; }
    public void setProfile(SustainabilityProfile profile) { this.profile = profile; }
    public double getCarbonEmissions() { return carbonEmissions; }
    public void setCarbonEmissions(double carbonEmissions) { this.carbonEmissions = carbonEmissions; }
    public double getEnergyConsumption() { return energyConsumption; }
    public void setEnergyConsumption(double energyConsumption) { this.energyConsumption = energyConsumption; }
    public double getWasteProduction() { return wasteProduction; }
    public void setWasteProduction(double wasteProduction) { this.wasteProduction = wasteProduction; }
    public double getEevtaScore() { return eevtaScore; }
    public void setEevtaScore(double eevtaScore) { this.eevtaScore = eevtaScore; }
    public double getRevenue() { return revenue; }
    public void setRevenue(double revenue) { this.revenue = revenue; }
    public double getCosts() { return costs; }
    public void setCosts(double costs) { this.costs = costs; }
    public double getInvestment() { return investment; }
    public void setInvestment(double investment) { this.investment = investment; }
    public double getEnvironmentalScore() { return environmentalScore; }
    public void setEnvironmentalScore(double environmentalScore) { this.environmentalScore = environmentalScore; }
    public double getSocialScore() { return socialScore; }
    public void setSocialScore(double socialScore) { this.socialScore = socialScore; }
    public double getSustainabilityScore() { return sustainabilityScore; }
    public void setSustainabilityScore(double sustainabilityScore) { this.sustainabilityScore = sustainabilityScore; }
    public double getRoi() { return roi; }
    public void setRoi(double roi) { this.roi = roi; }
    public double getCostBenefit() { return costBenefit; }
    public void setCostBenefit(double costBenefit) { this.costBenefit = costBenefit; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
