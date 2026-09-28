package com.sustainability.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EnergyRequest {
    private String industry;
    @JsonProperty("num_employees") private String numEmployees;
    private String monthlyElectricity;
    private String vehicleFuel;
    private String fuelType;
    private String heatingFuel;
    private String waterConsumption;
    @JsonProperty("renewable_pct") private String renewablePct;

    public EnergyRequest() {}
    public String getIndustry() { return industry; }
    public void setIndustry(String v) { this.industry = v; }
    public String getNumEmployees() { return numEmployees; }
    public void setNumEmployees(String v) { this.numEmployees = v; }
    public String getMonthlyElectricity() { return monthlyElectricity; }
    public void setMonthlyElectricity(String v) { this.monthlyElectricity = v; }
    public String getVehicleFuel() { return vehicleFuel; }
    public void setVehicleFuel(String v) { this.vehicleFuel = v; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String v) { this.fuelType = v; }
    public String getHeatingFuel() { return heatingFuel; }
    public void setHeatingFuel(String v) { this.heatingFuel = v; }
    public String getWaterConsumption() { return waterConsumption; }
    public void setWaterConsumption(String v) { this.waterConsumption = v; }
    public String getRenewablePct() { return renewablePct; }
    public void setRenewablePct(String v) { this.renewablePct = v; }
}
