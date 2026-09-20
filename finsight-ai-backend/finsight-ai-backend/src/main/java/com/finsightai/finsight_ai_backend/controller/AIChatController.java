package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.service.impl.AIChatServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIChatController {

    private final AIChatServiceImpl aiChatService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> handleAIChatRequest(
            @RequestBody Map<String, String> requestPayload,
            Authentication authentication) {

        String userPrompt = requestPayload.get("message");

        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Message cannot be empty."
            ));
        }

        try {

            System.out.println("==========================================");
            System.out.println("AI CHAT REQUEST");
            System.out.println("Authentication: " + authentication);

            if (authentication == null) {
                System.out.println("AUTHENTICATION IS NULL");
                System.out.println("==========================================");

                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "Authentication is missing."
                ));
            }

            System.out.println(
                    "Authenticated: " +
                            authentication.isAuthenticated()
            );

            System.out.println(
                    "Principal: " +
                            authentication.getPrincipal()
            );

            System.out.println(
                    "Authentication Name: " +
                            authentication.getName()
            );

            System.out.println(
                    "Authorities: " +
                            authentication.getAuthorities()
            );

            System.out.println("==========================================");

            String aiResponse =
                    aiChatService.generateAIResponse(
                            userPrompt,
                            authentication
                    );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "reply", aiResponse
            ));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Failed to generate AI response.",
                    "error", e.getMessage() == null
                            ? "Unknown backend error"
                            : e.getMessage()
            ));
        }
    }
} 