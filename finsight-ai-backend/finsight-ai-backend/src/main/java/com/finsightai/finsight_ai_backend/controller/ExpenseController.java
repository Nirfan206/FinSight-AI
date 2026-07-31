package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.dto.request.ExpenseRequest;
import com.finsightai.finsight_ai_backend.dto.response.ApiResponse;
import com.finsightai.finsight_ai_backend.dto.response.ExpenseResponse;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        ExpenseResponse response = expenseService.createExpense(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ExpenseResponse>builder()
                        .success(true)
                        .message("Expense entry registered inside transaction cluster.")
                        .data(response)
                        .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        ExpenseResponse response = expenseService.updateExpense(id, request, principal);
        return ResponseEntity.ok(ApiResponse.<ExpenseResponse>builder()
                .success(true)
                .message("Expense entry modifications committed.")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        ExpenseResponse response = expenseService.getExpenseById(id, principal);
        return ResponseEntity.ok(ApiResponse.<ExpenseResponse>builder()
                .success(true)
                .message("Expense record parsed successfully.")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ExpenseResponse>>> getAllExpenses(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 10, sort = "recordDate") Pageable pageable) {

        try {
            Page<ExpenseResponse> response = expenseService.getAllExpenses(principal, pageable);

            if (response == null) {
                response = Page.empty(pageable);
            }

            return ResponseEntity.ok(ApiResponse.<Page<ExpenseResponse>>builder()
                    .success(true)
                    .message("Paginated expense historical telemetry synced.")
                    .data(response)
                    .build());
        } catch (Exception e) {
            log.error("Failed to sync expense parameters from cluster. Initializing empty baseline matrix.", e);
            return ResponseEntity.ok(ApiResponse.<Page<ExpenseResponse>>builder()
                    .success(true)
                    .message("Cluster sync initialized to empty baseline ledger.")
                    .data(Page.empty(pageable))
                    .build());
        }
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getExpensesByDateRange(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            List<ExpenseResponse> response = expenseService.getExpensesByDateRange(principal, startDate, endDate);

            if (response == null) {
                response = Collections.emptyList();
            }

            return ResponseEntity.ok(ApiResponse.<List<ExpenseResponse>>builder()
                    .success(true)
                    .message("Historical bounds tracking extracted.")
                    .data(response)
                    .build());
        } catch (Exception e) {
            log.error("Failed to sync expense date range elements from cluster.", e);
            return ResponseEntity.ok(ApiResponse.<List<ExpenseResponse>>builder()
                    .success(true)
                    .message("Empty tracking bounds initialized.")
                    .data(Collections.emptyList())
                    .build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        expenseService.deleteExpense(id, principal);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Expense item purged from memory arrays permanently.")
                .data(null)
                .build());
    }

    @GetMapping("/monthly-total")
    public ResponseEntity<ApiResponse<BigDecimal>> getMonthlyTotal(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam int month,
            @RequestParam int year) {

        try {
            BigDecimal total = expenseService.getTotalExpenseByMonth(principal, month, year);
            return ResponseEntity.ok(ApiResponse.<BigDecimal>builder()
                    .success(true)
                    .message("Aggregated outbound calculation matrix closed.")
                    .data(total != null ? total : BigDecimal.ZERO)
                    .build());
        } catch (Exception e) {
            log.error("Error calculating monthly expense totals, defaulting to zero.", e);
            return ResponseEntity.ok(ApiResponse.<BigDecimal>builder()
                    .success(true)
                    .message("Fallback outbound calculation matrix closed at zero.")
                    .data(BigDecimal.ZERO)
                    .build());
        }
    }

    @GetMapping("/category-total")
    public ResponseEntity<ApiResponse<BigDecimal>> getCategoryTotal(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String category,
            @RequestParam int month,
            @RequestParam int year) {

        try {
            BigDecimal total = expenseService.getTotalExpenseByCategoryAndMonth(principal, category, month, year);
            return ResponseEntity.ok(ApiResponse.<BigDecimal>builder()
                    .success(true)
                    .message("Category specific calculation limit analyzed.")
                    .data(total != null ? total : BigDecimal.ZERO)
                    .build());
        } catch (Exception e) {
            log.error("Error calculating category expense totals, defaulting to zero.", e);
            return ResponseEntity.ok(ApiResponse.<BigDecimal>builder()
                    .success(true)
                    .message("Fallback category calculation matrix closed at zero.")
                    .data(BigDecimal.ZERO)
                    .build());
        }
    }
}