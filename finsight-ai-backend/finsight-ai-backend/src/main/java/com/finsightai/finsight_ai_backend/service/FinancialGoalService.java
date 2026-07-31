package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.dto.request.FinancialGoalRequest;
import com.finsightai.finsight_ai_backend.dto.response.FinancialGoalResponse;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;

import java.math.BigDecimal;
import java.util.List;

public interface FinancialGoalService {

    FinancialGoalResponse createGoal(FinancialGoalRequest request, UserPrincipal principal);

    FinancialGoalResponse updateGoal(Long goalId, FinancialGoalRequest request, UserPrincipal principal);

    FinancialGoalResponse addContribution(Long goalId, BigDecimal amount, UserPrincipal principal);

    FinancialGoalResponse getGoalById(Long goalId, UserPrincipal principal);

    List<FinancialGoalResponse> getAllGoals(UserPrincipal principal);

    List<FinancialGoalResponse> getGoalsByStatus(UserPrincipal principal, String status);

    void deleteGoal(Long goalId, UserPrincipal principal);

    void checkAndProcessOverdueGoals(UserPrincipal principal);
}