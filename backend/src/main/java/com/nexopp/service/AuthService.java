package com.nexopp.service;

import com.nexopp.dto.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    String generateJwt(com.nexopp.entity.User user);
    com.nexopp.entity.User validateUser(String identifier, String password);
    ApiResponse<Void> sendOtp(SendOtpRequest request);
    ApiResponse<Void> verifyOtp(VerifyOtpRequest request);
}
