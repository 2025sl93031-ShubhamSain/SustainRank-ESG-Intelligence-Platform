package com.sustainability.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CarbonRequest {
    private String industry;
    @JsonProperty("num_employees") private String numEmployees;
    private String elec;
    @JsonProperty("renewable_pct") private String renewablePct;
    private String gas;
    private String vefeul;
    private String machine;
    @JsonProperty("flights-4-less") private String flightsShort;
    @JsonProperty("flights-4-more") private String flightsLong;
    private String transexp;
    private String newspaperOptionsRadios;
    private String alumtinOptionsRadios;

    public CarbonRequest() {}
    public String getIndustry() { return industry; }
    public void setIndustry(String v) { this.industry = v; }
    public String getNumEmployees() { return numEmployees; }
    public void setNumEmployees(String v) { this.numEmployees = v; }
    public String getElec() { return elec; }
    public void setElec(String v) { this.elec = v; }
    public String getRenewablePct() { return renewablePct; }
    public void setRenewablePct(String v) { this.renewablePct = v; }
    public String getGas() { return gas; }
    public void setGas(String v) { this.gas = v; }
    public String getVefeul() { return vefeul; }
    public void setVefeul(String v) { this.vefeul = v; }
    public String getMachine() { return machine; }
    public void setMachine(String v) { this.machine = v; }
    public String getFlightsShort() { return flightsShort; }
    public void setFlightsShort(String v) { this.flightsShort = v; }
    public String getFlightsLong() { return flightsLong; }
    public void setFlightsLong(String v) { this.flightsLong = v; }
    public String getTransexp() { return transexp; }
    public void setTransexp(String v) { this.transexp = v; }
    public String getNewspaperOptionsRadios() { return newspaperOptionsRadios; }
    public void setNewspaperOptionsRadios(String v) { this.newspaperOptionsRadios = v; }
    public String getAlumtinOptionsRadios() { return alumtinOptionsRadios; }
    public void setAlumtinOptionsRadios(String v) { this.alumtinOptionsRadios = v; }
}
