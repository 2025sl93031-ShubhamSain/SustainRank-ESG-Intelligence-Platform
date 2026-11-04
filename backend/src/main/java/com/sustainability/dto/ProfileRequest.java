package com.sustainability.dto;

public class ProfileRequest {
    private String companyName;
    private String industry;
    private int numEmployees;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public int getNumEmployees() { return numEmployees; }
    public void setNumEmployees(int numEmployees) { this.numEmployees = numEmployees; }
}
