package com.sustainability.dto;

public class LoginRequest {
    private String username;
    private String password;
    public LoginRequest() {}
    public LoginRequest(String username, String password) { this.username = username; this.password = password; }
    public String getUsername() { return username; }
    public void setUsername(String v) { this.username = v; }
    public String getPassword() { return password; }
    public void setPassword(String v) { this.password = v; }
    public String username() { return username; }
    public String password() { return password; }
}
