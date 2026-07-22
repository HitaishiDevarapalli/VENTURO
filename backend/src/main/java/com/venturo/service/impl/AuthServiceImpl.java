package com.venturo.service.impl;

import com.venturo.dto.*;
import com.venturo.entity.User;
import com.venturo.exception.InvalidRequestException;
import com.venturo.exception.UnauthorizedException;
import com.venturo.exception.UserAlreadyExistsException;
import com.venturo.exception.UserNotFoundException;
import com.venturo.repository.UserRepository;
import com.venturo.security.JwtTokenProvider;
import com.venturo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    public void sendOtp(SendOtpRequest request) {
        // TODO: Implement SMS logic here (e.g., using Twilio, AWS SNS, etc.)
        // For now, it's just a mock
        System.out.println("Sending OTP to " + request.getMobile() + ": 1234");
    }

    @Override
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        // TODO: Validate the actual OTP from DB or Cache. Mocking as "1234"
        if (!"1234".equals(request.getOtp())) {
            throw new UnauthorizedException("Invalid OTP");
        }

        User user = userRepository.findByMobile(request.getMobile())
                .orElseThrow(() -> new UserNotFoundException("User not found with mobile: " + request.getMobile()));
        
        String token = jwtTokenProvider.generateTokenFromMobile(user.getMobile());
        
        return AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        return AuthResponse.builder()
                .token(jwt)
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email is already in use!");
        }
        if (request.getMobile() != null && userRepository.existsByMobile(request.getMobile())) {
            throw new UserAlreadyExistsException("Mobile number is already in use!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .passwordHash(request.getPassword() != null ? passwordEncoder.encode(request.getPassword()) : null)
                .role(request.getRole() != null ? request.getRole() : "ROLE_USER")
                .build();

        User savedUser = userRepository.save(user);
        
        String token = jwtTokenProvider.generateTokenFromEmail(savedUser.getEmail() != null ? savedUser.getEmail() : savedUser.getMobile());

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(savedUser))
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(user.getRole())
                .build();
    }
}
