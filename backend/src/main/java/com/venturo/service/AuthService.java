package com.venturo.service;

import com.venturo.dto.AuthResponse;
import com.venturo.dto.LoginRequest;
import com.venturo.dto.RegisterRequest;
import com.venturo.dto.SendOtpRequest;
import com.venturo.dto.VerifyOtpRequest;

public interface AuthService {
    void sendOtp(SendOtpRequest request);
    AuthResponse verifyOtp(VerifyOtpRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
