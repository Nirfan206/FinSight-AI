package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.service.impl.AIChatServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIChatController {

    private final AIChatServiceImpl aiChatService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> handleAIChatRequest(
            @RequestBody Map<String, String> requestPayload) {

        String userPrompt = requestPayload.get("message");

        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Message cannot be empty."
            ));
        }

        try {
            String aiResponse = aiChatService.generateAIResponse(userPrompt);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "reply", aiResponse
            ));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to generate AI response.",
                    "error", e.getMessage()
            ));
        }
    }
}