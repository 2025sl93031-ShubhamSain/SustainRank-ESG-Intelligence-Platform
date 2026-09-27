package com.sustainability.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sustainability_profile")
public class SustainabilityProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private AppUser user;

    @Column(name = "company_name", length = 100, nullable = false)
    private String companyName = "";

    @Column(length = 100)
    private String industry = "General";

    @Column(name = "num_employees")
    private int numEmployees = 1;

    @Column(name = "carbon_score") private double carbonScore = 0;
    @Column(name = "carbon_intensity") private double carbonIntensity = 0;
    @Column(name = "electricity_usage") private double electricityUsage = 0;
    @Column(name = "gas_consumption") private double gasConsumption = 0;

    @Column(name = "energy_total") private double energyTotal = 0;
    @Column(name = "electricity_kwh") private double electricityKwh = 0;
    @Column(name = "renewable_pct") private double renewablePct = 0;
    @Column(name = "energy_intensity") private double energyIntensity = 0;

    @Column(name = "total_waste") private double totalWaste = 0;
    @Column(name = "recycled_waste") private double recycledWaste = 0;
    @Column(name = "composted_waste") private double compostedWaste = 0;
    @Column(name = "waste_reduction_rate") private double wasteReductionRate = 0;
    @Column(name = "waste_diversion_rate") private double wasteDiversionRate = 0;

    @Column(name = "eevta_score") private double eevtaScore = 0;
    @Column(name = "total_students") private int totalStudents = 0;
    @Column(name = "tech_voc_percentage") private double techVocPercentage = 0;

    @Column(name = "environmental_score") private double environmentalScore = 0;
    @Column(name = "social_score") private double socialScore = 0;
    @Column(name = "sustainability_score") private double sustainabilityScore = 0;

    private double roi = 0;
    @Column(name = "cost_benefit") private double costBenefit = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public SustainabilityProfile() {}

    public Long getId() { return id; }
    public AppUser getUser() { return user; }
    public void setUser(AppUser user) { this.user = user; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public int getNumEmployees() { return numEmployees; }
    public void setNumEmployees(int numEmployees) { this.numEmployees = numEmployees; }
    public double getCarbonScore() { return carbonScore; }
    public void setCarbonScore(double carbonScore) { this.carbonScore = carbonScore; }
    public double getCarbonIntensity() { return carbonIntensity; }
    public void setCarbonIntensity(double carbonIntensity) { this.carbonIntensity = carbonIntensity; }
    public double getElectricityUsage() { return electricityUsage; }
    public void setElectricityUsage(double electricityUsage) { this.electricityUsage = electricityUsage; }
    public double getGasConsumption() { return gasConsumption; }
    public void setGasConsumption(double gasConsumption) { this.gasConsumption = gasConsumption; }
    public double getEnergyTotal() { return energyTotal; }
    public void setEnergyTotal(double energyTotal) { this.energyTotal = energyTotal; }
    public double getElectricityKwh() { return electricityKwh; }
    public void setElectricityKwh(double electricityKwh) { this.electricityKwh = electricityKwh; }
    public double getRenewablePct() { return renewablePct; }
    public void setRenewablePct(double renewablePct) { this.renewablePct = renewablePct; }
    public double getEnergyIntensity() { return energyIntensity; }
    public void setEnergyIntensity(double energyIntensity) { this.energyIntensity = energyIntensity; }
    public double getTotalWaste() { return totalWaste; }
    public void setTotalWaste(double totalWaste) { this.totalWaste = totalWaste; }
    public double getRecycledWaste() { return recycledWaste; }
    public void setRecycledWaste(double recycledWaste) { this.recycledWaste = recycledWaste; }
    public double getCompostedWaste() { return compostedWaste; }
    public void setCompostedWaste(double compostedWaste) { this.compostedWaste = compostedWaste; }
    public double getWasteReductionRate() { return wasteReductionRate; }
    public void setWasteReductionRate(double wasteReductionRate) { this.wasteReductionRate = wasteReductionRate; }
    public double getWasteDiversionRate() { return wasteDiversionRate; }
    public void setWasteDiversionRate(double wasteDiversionRate) { this.wasteDiversionRate = wasteDiversionRate; }
    public double getEevtaScore() { return eevtaScore; }
    public void setEevtaScore(double eevtaScore) { this.eevtaScore = eevtaScore; }
    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }
    public double getTechVocPercentage() { return techVocPercentage; }
    public void setTechVocPercentage(double techVocPercentage) { this.techVocPercentage = techVocPercentage; }
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
