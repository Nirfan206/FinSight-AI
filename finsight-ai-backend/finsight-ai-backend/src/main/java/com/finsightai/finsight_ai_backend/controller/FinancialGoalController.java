package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.dto.request.FinancialGoalRequest;
import com.finsightai.finsight_ai_backend.dto.response.ApiResponse;
import com.finsightai.finsight_ai_backend.dto.response.FinancialGoalResponse;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.FinancialGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FinancialGoalController {

    private final FinancialGoalService financialGoalService;

    @PostMapping
    public ResponseEntity<ApiResponse<FinancialGoalResponse>> createGoal(
            @Valid @RequestBody FinancialGoalRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        FinancialGoalResponse response = financialGoalService.createGoal(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<FinancialGoalResponse>builder()
                        .success(true)
                        .message("Financial target goal tracking node initialized.")
                        .data(response)
                        .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FinancialGoalResponse>> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody FinancialGoalRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        FinancialGoalResponse response = financialGoalService.updateGoal(id, request, principal);
        return ResponseEntity.ok(ApiResponse.<FinancialGoalResponse>builder()
                .success(true)
                .message("Financial target configuration matrix updated.")
                .data(response)
                .build());
    }

    @PatchMapping("/{id}/contribution")
    public ResponseEntity<ApiResponse<FinancialGoalResponse>> addContribution(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal UserPrincipal principal) {

        FinancialGoalResponse response = financialGoalService.addContribution(id, amount, principal);
        return ResponseEntity.ok(ApiResponse.<FinancialGoalResponse>builder()
                .success(true)
                .message("Capital allocation contribution committed successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FinancialGoalResponse>> getGoalById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        FinancialGoalResponse response = financialGoalService.getGoalById(id, principal);
        return ResponseEntity.ok(ApiResponse.<FinancialGoalResponse>builder()
                .success(true)
                .message("Target benchmark metrics parsed successfully.")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FinancialGoalResponse>>> getAllGoals(
            @AuthenticationPrincipal UserPrincipal principal) {

        List<FinancialGoalResponse> response = financialGoalService.getAllGoals(principal);
        return ResponseEntity.ok(ApiResponse.<List<FinancialGoalResponse>>builder()
                .success(true)
                .message("Active portfolio asset goals synchronized.")
                .data(response)
                .build());
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<List<FinancialGoalResponse>>> getGoalsByStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String status) {

        List<FinancialGoalResponse> response = financialGoalService.getGoalsByStatus(principal, status);
        return ResponseEntity.ok(ApiResponse.<List<FinancialGoalResponse>>builder()
                .success(true)
                .message("Filtered target state blocks generated.")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        financialGoalService.deleteGoal(id, principal);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Financial goal structural record deleted securely.")
                .data(null)
                .build());
    }

    @PostMapping("/sync-overdue")
    public ResponseEntity<ApiResponse<Void>> triggerOverdueCheck(
            @AuthenticationPrincipal UserPrincipal principal) {

        financialGoalService.checkAndProcessOverdueGoals(principal);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Asynchronous calendar validation sweep completed successfully.")
                .data(null)
                .build());
    }
}