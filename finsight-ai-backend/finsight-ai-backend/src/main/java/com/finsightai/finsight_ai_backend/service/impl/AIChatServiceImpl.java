package com.finsightai.finsight_ai_backend.service.impl;

import com.google.genai.Client;
import com.google.genai.errors.ClientException;
import com.google.genai.types.GenerateContentResponse;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AIChatServiceImpl {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private Client client;

    @PostConstruct
    public void init() {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API Key is missing.");
        }

        if (model == null || model.isBlank()) {
            throw new IllegalStateException("Gemini model is missing.");
        }

        client = Client.builder()
                .apiKey(apiKey)
                .build();

        log.info("==========================================");
        log.info("Gemini Client Initialized Successfully");
        log.info("Model : {}", model);
        log.info("==========================================");
    }

    public String generateAIResponse(String userPrompt) {

        if (client == null) {
            throw new IllegalStateException("Gemini Client is not initialized.");
        }

        if (userPrompt == null || userPrompt.isBlank()) {
            throw new IllegalArgumentException("User prompt cannot be empty.");
        }

        String prompt = """
                You are FinSight AI, an intelligent personal finance assistant.

                Responsibilities:
                - Expense Tracking
                - Budget Planning
                - Savings Suggestions
                - Investment Guidance
                - Financial Education
                - Debt Management

                Keep responses:
                - Short
                - Practical
                - Friendly
                - Easy to understand

                User Question:
                """ + userPrompt;

        try {

            log.info("Calling Gemini Model : {}", model);

            GenerateContentResponse response =
                    client.models.generateContent(
                            model,
                            prompt,
                            null
                    );

            if (response == null) {
                throw new RuntimeException("Gemini returned null response.");
            }

            String answer = response.text();

            if (answer == null || answer.isBlank()) {
                throw new RuntimeException("Gemini returned empty response.");
            }

            return answer.trim();

        } catch (ClientException e) {

            log.error("Gemini Client Error", e);

            throw new RuntimeException(
                    "Gemini API Error: " + e.getMessage(),
                    e
            );

        } catch (Exception e) {

            log.error("Unexpected Gemini Error", e);

            throw new RuntimeException(
                    "Failed to generate AI response.",
                    e
            );
        }
    }
}