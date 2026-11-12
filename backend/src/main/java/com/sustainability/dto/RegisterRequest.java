package com.sustainability.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Company name is required")
    private String company_name;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 150, message = "Username must be 3–150 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password1;

    @NotBlank(message = "Password confirmation is required")
    private String password2;

    public RegisterRequest() {}
    public String getCompany_name() { return company_name; }
    public void setCompany_name(String v) { this.company_name = v; }
    public String getUsername() { return username; }
    public void setUsername(String v) { this.username = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPassword1() { return password1; }
    public void setPassword1(String v) { this.password1 = v; }
    public String getPassword2() { return password2; }
    public void setPassword2(String v) { this.password2 = v; }
    public String company_name() { return company_name; }
    public String username() { return username; }
    public String email() { return email; }
    public String password1() { return password1; }
    public String password2() { return password2; }
}
