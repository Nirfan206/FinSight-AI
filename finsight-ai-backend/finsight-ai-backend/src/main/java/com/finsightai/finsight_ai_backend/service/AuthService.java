package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.dto.request.LoginRequest;
import com.finsightai.finsight_ai_backend.dto.request.RefreshTokenRequest;
import com.finsightai.finsight_ai_backend.dto.request.RegisterRequest;
import com.finsightai.finsight_ai_backend.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    /**
     * Generates a new access token using a valid, unexpired refresh token.
     */
    AuthResponse refreshToken(RefreshTokenRequest request);

    /**
     * Securely logs out the user by revoking their refresh tokens.
     */
    void logout(RefreshTokenRequest request);
}