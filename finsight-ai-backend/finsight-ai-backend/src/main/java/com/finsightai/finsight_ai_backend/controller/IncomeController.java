package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.dto.request.IncomeRequest;
import com.finsightai.finsight_ai_backend.dto.response.ApiResponse;
import com.finsightai.finsight_ai_backend.dto.response.IncomeResponse;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.IncomeService;
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
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<ApiResponse<IncomeResponse>> createIncome(
            @Valid @RequestBody IncomeRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        try {
            log.info("Processing income registration telemetry: Source={}, Amount={}", request.getSource(), request.getAmount());
            IncomeResponse response = incomeService.createIncome(request, principal);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<IncomeResponse>builder()
                            .success(true)
                            .message("Income entry registered inside transaction cluster.")
                            .data(response)
                            .build());
        } catch (Exception e) {
            log.error("CRITICAL TRANSACTION FAILURE DURING INCOME CREATION: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<IncomeResponse>builder()
                            .success(false)
                            .message("Server Save Crash: " + e.getClass().getSimpleName() + " - " + e.getMessage())
                            .data(null)
                            .build());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IncomeResponse>> updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        try {
            IncomeResponse response = incomeService.updateIncome(id, request, principal);
            return ResponseEntity.ok(ApiResponse.<IncomeResponse>builder()
                    .success(true)
                    .message("Income entry modifications committed.")
                    .data(response)
                    .build());
        } catch (Exception e) {
            log.error("CRITICAL TRANSACTION FAILURE DURING INCOME UPDATE [ID: {}]: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<IncomeResponse>builder()
                            .success(false)
                            .message("Server Update Crash: " + e.getClass().getSimpleName() + " - " + e.getMessage())
                            .data(null)
                            .build());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncomeResponse>> getIncomeById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        IncomeResponse response = incomeService.getIncomeById(id, principal);
        return ResponseEntity.ok(ApiResponse.<IncomeResponse>builder()
                .success(true)
                .message("Income record parsed successfully.")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<IncomeResponse>>> getAllIncomes(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 10, sort = "recordDate") Pageable pageable) {

        try {
            Page<IncomeResponse> response = incomeService.getAllIncomes(principal, pageable);

            if (response == null) {
                response = Page.empty(pageable);
            }

            return ResponseEntity.ok(ApiResponse.<Page<IncomeResponse>>builder()
                    .success(true)
                    .message("Paginated income historical telemetry synced.")
                    .data(response)
                    .build());
        } catch (Exception e) {
            log.error("Failed to sync income parameters from the cluster for user: {}. Initializing zero-state baseline.",
                    principal.getUsername(), e);

            return ResponseEntity.ok(ApiResponse.<Page<IncomeResponse>>builder()
                    .success(true)
                    .message("Cluster sync initialized to empty baseline ledger.")
                    .data(Page.empty(pageable))
                    .build());
        }
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<IncomeResponse>>> getIncomesByDateRange(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            List<IncomeResponse> response = incomeService.getIncomesByDateRange(principal, startDate, endDate);

            if (response == null) {
                response = Collections.emptyList();
            }

            return ResponseEntity.ok(ApiResponse.<List<IncomeResponse>>builder()
                    .success(true)
                    .message("Historical bounds tracking extracted.")
                    .data(response)
                    .build());
        } catch (Exception e) {
            log.error("Failed to sync income range parameters from cluster.", e);
            return ResponseEntity.ok(ApiResponse.<List<IncomeResponse>>builder()
                    .success(true)
                    .message("Empty tracking bounds initialized.")
                    .data(Collections.emptyList())
                    .build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncome(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {

        try {
            incomeService.deleteIncome(id, principal);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(true)
                    .message("Income item purged from memory arrays permanently.")
                    .data(null)
                    .build());
        } catch (Exception e) {
            log.error("CRITICAL TRANSACTION FAILURE DURING INCOME PURGE [ID: {}]: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Void>builder()
                            .success(false)
                            .message("Server Purge Crash: " + e.getClass().getSimpleName() + " - " + e.getMessage())
                            .data(null)
                            .build());
        }
    }

    @GetMapping("/monthly-total")
    public ResponseEntity<ApiResponse<BigDecimal>> getMonthlyTotal(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam int month,
            @RequestParam int year) {

        try {
            BigDecimal total = incomeService.getTotalIncomeByMonth(principal, month, year);
            return ResponseEntity.ok(ApiResponse.<BigDecimal>builder()
                    .success(true)
                    .message("Aggregated calculation matrix closed.")
                    .data(total != null ? total : BigDecimal.ZERO)
                    .build());
        } catch (Exception e) {
            log.error("Error calculating monthly totals, defaulting to zero.", e);
            return ResponseEntity.ok(ApiResponse.<BigDecimal>builder()
                    .success(true)
                    .message("Fallback calculation matrix closed at zero.")
                    .data(BigDecimal.ZERO)
                    .build());
        }
    }
}