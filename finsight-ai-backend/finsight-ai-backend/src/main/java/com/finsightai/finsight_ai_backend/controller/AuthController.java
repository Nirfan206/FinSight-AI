package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.dto.request.LoginRequest;
import com.finsightai.finsight_ai_backend.dto.request.RegisterRequest;
import com.finsightai.finsight_ai_backend.dto.response.ApiResponse;
import com.finsightai.finsight_ai_backend.dto.response.AuthResponse;
import com.finsightai.finsight_ai_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<AuthResponse>builder()
                                .success(true)
                                .message("Registration successful")
                                .data(response)
                                .build()
                );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.<AuthResponse>builder()
                        .success(true)
                        .message("Login successful")
                        .data(response)
                        .build()
        );
    }

}