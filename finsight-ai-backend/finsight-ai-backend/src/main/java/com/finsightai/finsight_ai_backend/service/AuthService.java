package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.dto.request.LoginRequest;
import com.finsightai.finsight_ai_backend.dto.request.RegisterRequest;
import com.finsightai.finsight_ai_backend.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}