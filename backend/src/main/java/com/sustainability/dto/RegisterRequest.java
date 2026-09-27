package com.sustainability.dto;

public class RegisterRequest {
    private String company_name;
    private String username;
    private String email;
    private String password1;
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
    // Accessor aliases for service layer
    public String company_name() { return company_name; }
    public String username() { return username; }
    public String email() { return email; }
    public String password1() { return password1; }
    public String password2() { return password2; }
}
