package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.entity.Expense;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.repository.ExpenseRepository;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.google.genai.Client;
import com.google.genai.errors.ClientException;
import com.google.genai.types.GenerateContentResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIChatServiceImpl {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    private Client client;

    @PostConstruct
    public void init() {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Gemini API Key is missing."
            );
        }

        if (model == null || model.isBlank()) {
            throw new IllegalStateException(
                    "Gemini model is missing."
            );
        }

        client = Client.builder()
                .apiKey(apiKey)
                .build();

        log.info("==========================================");
        log.info("Gemini Client Initialized Successfully");
        log.info("Model : {}", model);
        log.info("==========================================");
    }

    public String generateAIResponse(
            String userPrompt,
            Authentication authentication) {

        if (client == null) {
            throw new IllegalStateException(
                    "Gemini Client is not initialized."
            );
        }

        if (userPrompt == null || userPrompt.isBlank()) {
            throw new IllegalArgumentException(
                    "User prompt cannot be empty."
            );
        }

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new IllegalArgumentException(
                    "User authentication is required."
            );
        }

        try {

            /*
             * -------------------------------------------------
             * 1. Get logged-in user's identity
             * -------------------------------------------------
             */

            String username = authentication.getName();

            log.info(
                    "AI request received from authenticated user: {}",
                    username
            );

            /*
             * -------------------------------------------------
             * 2. Find user in database
             * -------------------------------------------------
             */

            User user = userRepository
                    .findByEmail(username)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Authenticated user not found."
                            )
                    );

            /*
             * -------------------------------------------------
             * 3. Get current month's expenses
             * -------------------------------------------------
             */

            LocalDate today = LocalDate.now();

            LocalDate startDate =
                    today.withDayOfMonth(1);

            LocalDate endDate = today;

            List<Expense> expenses =
                    expenseRepository
                            .findByUserAndRecordDateBetween(
                                    user,
                                    startDate,
                                    endDate
                            );

            log.info(
                    "Retrieved {} expenses for user {}",
                    expenses.size(),
                    user.getUserId()
            );

            /*
             * -------------------------------------------------
             * 4. Build financial context
             * -------------------------------------------------
             */

            String financialContext =
                    buildFinancialContext(
                            user,
                            expenses,
                            startDate,
                            endDate
                    );

            /*
             * -------------------------------------------------
             * 5. Build AI prompt
             * -------------------------------------------------
             */

            String prompt = """
                    You are FinSight AI, an intelligent personal
                    finance assistant inside the FinSight application.

                    You are analyzing financial records stored in
                    the user's FinSight account.

                    IMPORTANT RULES:

                    1. Use the provided financial data when answering.
                    2. Do not claim that you can access bank accounts.
                    3. Do not invent transactions, amounts, categories,
                       income, budgets, or other financial information.
                    4. If the provided data does not contain enough
                       information to answer a question, clearly say so.
                    5. Keep responses short, practical, friendly,
                       and easy to understand.
                    6. Use Indian Rupee formatting when discussing
                       amounts.
                    7. Distinguish between actual recorded data and
                       general financial suggestions.
                    8. Never reveal another user's financial information.

                    USER:
                    Name: %s
                    User ID: %s

                    FINANCIAL DATA:
                    %s

                    USER QUESTION:
                    %s

                    Answer the user's question using the provided
                    FinSight financial data.
                    """.formatted(
                    user.getFullName(),
                    user.getUserId(),
                    financialContext,
                    userPrompt
            );

            /*
             * -------------------------------------------------
             * 6. Call Gemini
             * -------------------------------------------------
             */

            log.info(
                    "Calling Gemini Model: {}",
                    model
            );

            GenerateContentResponse response =
                    client.models.generateContent(
                            model,
                            prompt,
                            null
                    );

            if (response == null) {
                throw new RuntimeException(
                        "Gemini returned null response."
                );
            }

            String answer = response.text();

            if (answer == null || answer.isBlank()) {
                throw new RuntimeException(
                        "Gemini returned an empty response."
                );
            }

            return answer.trim();

        } catch (ClientException e) {

            log.error(
                    "Gemini Client Error: {}",
                    e.getMessage(),
                    e
            );

            throw new RuntimeException(
                    "Gemini API Error: " + e.getMessage(),
                    e
            );

        } catch (Exception e) {

            log.error(
                    "AI Chat Error: {}",
                    e.getMessage(),
                    e
            );

            throw new RuntimeException(
                    "Failed to generate AI response: "
                            + e.getMessage(),
                    e
            );
        }
    }

    private String buildFinancialContext(
            User user,
            List<Expense> expenses,
            LocalDate startDate,
            LocalDate endDate) {

        StringBuilder context = new StringBuilder();

        context.append("Analysis Period: ")
                .append(startDate)
                .append(" to ")
                .append(endDate)
                .append("\n\n");

        context.append("Total Expense Records: ")
                .append(expenses.size())
                .append("\n\n");

        if (expenses.isEmpty()) {

            context.append(
                    "No expense records were found for this period."
            );

            return context.toString();
        }

        /*
         * -------------------------------------------------
         * Total expenses
         * -------------------------------------------------
         */

        BigDecimal totalExpenses =
                expenses.stream()
                        .map(Expense::getAmount)
                        .filter(amount -> amount != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        context.append("Total Expenses: ₹")
                .append(totalExpenses)
                .append("\n\n");

        /*
         * -------------------------------------------------
         * Category totals
         * -------------------------------------------------
         */

        Map<String, BigDecimal> categoryTotals =
                expenses.stream()
                        .filter(e -> e.getCategory() != null)
                        .filter(e -> e.getAmount() != null)
                        .collect(Collectors.groupingBy(
                                Expense::getCategory,
                                Collectors.reducing(
                                        BigDecimal.ZERO,
                                        Expense::getAmount,
                                        BigDecimal::add
                                )
                        ));

        context.append("Expense By Category:\n");

        categoryTotals.forEach((category, amount) ->
                context.append("- ")
                        .append(category)
                        .append(": ₹")
                        .append(amount)
                        .append("\n")
        );

        context.append("\n");

        /*
         * -------------------------------------------------
         * Individual transactions
         * -------------------------------------------------
         */

        context.append("Expense Records:\n");

        for (Expense expense : expenses) {

            context.append("- Date: ")
                    .append(expense.getRecordDate())
                    .append(" | Category: ")
                    .append(expense.getCategory())
                    .append(" | Amount: ₹")
                    .append(expense.getAmount())
                    .append(" | Merchant: ")
                    .append(expense.getMerchant());

            if (expense.getDescription() != null &&
                    !expense.getDescription().isBlank()) {

                context.append(" | Description: ")
                        .append(expense.getDescription());
            }

            context.append("\n");
        }

        return context.toString();
    }
}