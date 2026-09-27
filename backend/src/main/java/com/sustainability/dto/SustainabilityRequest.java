package com.sustainability.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SustainabilityRequest {
    private String industry;
    private String carbon;
    private String energy;
    private String waste;
    private String evtaa;
    @JsonProperty("num_employees") private String numEmployees;
    @JsonProperty("renewable_pct") private String renewablePct;
    @JsonProperty("waste_diversion") private String wasteDiversion;
    private String revenue;
    private String cost;
    private String inv;

    public SustainabilityRequest() {}
    public String getIndustry() { return industry; }
    public void setIndustry(String v) { this.industry = v; }
    public String getCarbon() { return carbon; }
    public void setCarbon(String v) { this.carbon = v; }
    public String getEnergy() { return energy; }
    public void setEnergy(String v) { this.energy = v; }
    public String getWaste() { return waste; }
    public void setWaste(String v) { this.waste = v; }
    public String getEvtaa() { return evtaa; }
    public void setEvtaa(String v) { this.evtaa = v; }
    public String getNumEmployees() { return numEmployees; }
    public void setNumEmployees(String v) { this.numEmployees = v; }
    public String getRenewablePct() { return renewablePct; }
    public void setRenewablePct(String v) { this.renewablePct = v; }
    public String getWasteDiversion() { return wasteDiversion; }
    public void setWasteDiversion(String v) { this.wasteDiversion = v; }
    public String getRevenue() { return revenue; }
    public void setRevenue(String v) { this.revenue = v; }
    public String getCost() { return cost; }
    public void setCost(String v) { this.cost = v; }
    public String getInv() { return inv; }
    public void setInv(String v) { this.inv = v; }
}
