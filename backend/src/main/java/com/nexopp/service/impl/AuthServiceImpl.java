package com.nexopp.service.impl;

import com.nexopp.dto.*;
import com.nexopp.entity.Role;
import com.nexopp.entity.User;
import com.nexopp.exception.InvalidCredentialsException;
import com.nexopp.exception.UserAlreadyExistsException;
import com.nexopp.repository.UserRepository;
import com.nexopp.security.CustomUserDetails;
import com.nexopp.security.JwtUtils;
import com.nexopp.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (request.getMobile() != null && userRepository.existsByMobile(request.getMobile())) {
            throw new UserAlreadyExistsException("User with mobile already exists.");
        }
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User with email already exists.");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setMobile(request.getMobile());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        String token = generateJwt(savedUser);

        return new AuthResponse(token, mapToUserResponse(savedUser));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = validateUser(request.getEmailOrMobile(), request.getPassword());
        String token = generateJwt(user);
        return new AuthResponse(token, mapToUserResponse(user));
    }

    @Override
    public String generateJwt(User user) {
        return jwtUtils.generateToken(new CustomUserDetails(user));
    }

    @Override
    public User validateUser(String identifier, String password) {
        User user;
        if (identifier.contains("@")) {
            user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
        } else {
            user = userRepository.findByMobile(identifier)
                    .orElseThrow(() -> new InvalidCredentialsException("Invalid mobile or password"));
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email/mobile or password");
        }

        return user;
    }

    @Override
    public ApiResponse<Void> sendOtp(SendOtpRequest request) {
        // TODO: Integrate MSG91/Twilio/Firebase SMS Provider here
        return new ApiResponse<>(true, "OTP service not integrated yet.");
    }

    @Override
    public ApiResponse<Void> verifyOtp(VerifyOtpRequest request) {
        // TODO: Integrate MSG91/Twilio/Firebase SMS Provider here
        return new ApiResponse<>(true, "OTP service not integrated yet.");
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setMobile(user.getMobile());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setEnabled(user.isEnabled());
        return response;
    }
}
