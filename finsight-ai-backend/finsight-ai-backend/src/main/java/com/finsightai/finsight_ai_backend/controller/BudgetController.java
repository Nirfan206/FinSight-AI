package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.dto.request.BudgetRequest;
import com.finsightai.finsight_ai_backend.dto.response.ApiResponse;
import com.finsightai.finsight_ai_backend.dto.response.BudgetResponse;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> createOrUpdateBudget(
            @Valid @RequestBody BudgetRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        BudgetResponse response = budgetService.createOrUpdateBudget(request, principal);
        return ResponseEntity.ok(
                ApiResponse.<BudgetResponse>builder()
                        .success(true)
                        .message("Budget configuration committed successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudgetById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        BudgetResponse response = budgetService.getBudgetById(id, principal);
        return ResponseEntity.ok(
                ApiResponse.<BudgetResponse>builder()
                        .success(true)
                        .message("Budget constraint parsed successfully.")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/period")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgetsByPeriod(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam int month,
            @RequestParam int year) {

        List<BudgetResponse> response = budgetService.getBudgetsByPeriod(principal, month, year);
        return ResponseEntity.ok(
                ApiResponse.<List<BudgetResponse>>builder()
                        .success(true)
                        .message("Target period budget matrices synchronized.")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        budgetService.deleteBudget(id, principal);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Budget rule removed successfully.")
                        .data(null)
                        .build()
        );
    }
}