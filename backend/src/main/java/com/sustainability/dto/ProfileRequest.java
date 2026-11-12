package com.sustainability.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class ProfileRequest {
    @Size(max = 100, message = "Company name must be under 100 characters")
    private String companyName;

    @Size(max = 100, message = "Industry must be under 100 characters")
    private String industry;

    @Min(value = 1, message = "Number of employees must be at least 1")
    private int numEmployees;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public int getNumEmployees() { return numEmployees; }
    public void setNumEmployees(int numEmployees) { this.numEmployees = numEmployees; }
}
