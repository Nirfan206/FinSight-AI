package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.dto.response.ApiResponse;
import com.finsightai.finsight_ai_backend.dto.response.DashboardSummaryResponse;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        // Fallback to current calendar values if parameters aren't supplied by client
        int searchMonth = (month != null) ? month : LocalDate.now().getMonthValue();
        int searchYear = (year != null) ? year : LocalDate.now().getYear();

        DashboardSummaryResponse summary = dashboardService.getDashboardSummary(principal, searchMonth, searchYear);

        return ResponseEntity.ok(
                ApiResponse.<DashboardSummaryResponse>builder()
                        .success(true)
                        .message("Financial analytics tracking telemetry compiled.")
                        .data(summary)
                        .build()
        );
    }
}