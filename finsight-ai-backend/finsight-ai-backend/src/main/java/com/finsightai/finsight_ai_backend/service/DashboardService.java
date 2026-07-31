package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.dto.response.DashboardSummaryResponse;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;

public interface DashboardService {

    /**
     * Aggregates total incomes, expenses, savings ratios, and recent transactions
     * for a centralized dashboard payload view.
     */
    DashboardSummaryResponse getDashboardSummary(UserPrincipal principal, int month, int year);
}