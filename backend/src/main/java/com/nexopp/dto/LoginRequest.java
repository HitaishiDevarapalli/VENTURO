package com.nexopp.dto;

public class LoginRequest {
    private String emailOrMobile;
    private String password;

    public String getEmailOrMobile() { return emailOrMobile; }
    public void setEmailOrMobile(String emailOrMobile) { this.emailOrMobile = emailOrMobile; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
