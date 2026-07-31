package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.dto.request.LoginRequest;
import com.finsightai.finsight_ai_backend.dto.request.RefreshTokenRequest;
import com.finsightai.finsight_ai_backend.dto.request.RegisterRequest;
import com.finsightai.finsight_ai_backend.dto.response.AuthResponse;
import com.finsightai.finsight_ai_backend.entity.RefreshToken;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.enums.AccountStatus;
import com.finsightai.finsight_ai_backend.enums.Role;
import com.finsightai.finsight_ai_backend.exception.DuplicateResourceException;
import com.finsightai.finsight_ai_backend.exception.InvalidCredentialsException;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.finsightai.finsight_ai_backend.security.JwtUtil;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.AuthService;
import com.finsightai.finsight_ai_backend.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered.");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setAccountStatus(AccountStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    // FIXED: Removed (readOnly = true) to allow internal write operations such as creating new Refresh Tokens
    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new InvalidCredentialsException("Account is not active. Please contact support.");
        }

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken storedToken = refreshTokenService.findByToken(request.getRefreshToken());
        RefreshToken validToken = refreshTokenService.verifyExpiration(storedToken);

        User user = validToken.getUser();
        String newAccessToken = jwtUtil.generateAccessToken(UserPrincipal.create(user));

        return AuthResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(newAccessToken)
                .refreshToken(validToken.getToken())
                .expiresIn(jwtUtil.getAccessTokenExpirationMs())
                .build();
    }

    @Override
    @Transactional
    public void logout(RefreshTokenRequest request) {
        RefreshToken storedToken = refreshTokenService.findByToken(request.getRefreshToken());
        refreshTokenService.revokeAllUserTokens(storedToken.getUser());
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = jwtUtil.generateAccessToken(principal);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(accessToken)
                .refreshToken(refreshToken.getToken())
                .expiresIn(jwtUtil.getAccessTokenExpirationMs())
                .build();
    }
}