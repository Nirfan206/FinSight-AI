package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.dto.request.BudgetRequest;
import com.finsightai.finsight_ai_backend.dto.response.BudgetResponse;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;

import java.util.List;

public interface BudgetService {

    /**
     * Creates a new budget or replaces an existing one for a category and period.
     */
    BudgetResponse createOrUpdateBudget(BudgetRequest request, UserPrincipal principal);

    /**
     * Retrieves a single budget record by its unique identifier.
     */
    BudgetResponse getBudgetById(Long budgetId, UserPrincipal principal);

    /**
     * Fetches all configured budgets for a user within a target monthly cycle.
     */
    List<BudgetResponse> getBudgetsByPeriod(UserPrincipal principal, int month, int year);

    /**
     * Deletes a budget constraint securely from the system.
     */
    void deleteBudget(Long budgetId, UserPrincipal principal);

    /**
     * Evaluates a user's spending against their budget for a given category and month.
     * Automatically triggers system notifications if thresholds are exceeded.
     * Kept with raw 'User' parameter to support internal automated calls from ExpenseServiceImpl.
     */
    void checkBudgetThresholds(User user, String category, int month, int year);
}