package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.dto.request.LoginRequest;
import com.finsightai.finsight_ai_backend.dto.request.RegisterRequest;
import com.finsightai.finsight_ai_backend.dto.response.AuthResponse;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.enums.AccountStatus;
import com.finsightai.finsight_ai_backend.enums.Role;
import com.finsightai.finsight_ai_backend.exception.DuplicateResourceException;
import com.finsightai.finsight_ai_backend.exception.InvalidCredentialsException;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.finsightai.finsight_ai_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .userId(savedUser.getUserId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .token(null) // JWT will be added later
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        return AuthResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(null) // JWT will be added later
                .build();
    }
}