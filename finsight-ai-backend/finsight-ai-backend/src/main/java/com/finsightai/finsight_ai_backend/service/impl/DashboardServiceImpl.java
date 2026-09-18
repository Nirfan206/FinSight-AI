package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.dto.response.DashboardSummaryResponse;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.exception.ResourceNotFoundException;
import com.finsightai.finsight_ai_backend.repository.ExpenseRepository;
import com.finsightai.finsight_ai_backend.repository.IncomeRepository;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    public DashboardSummaryResponse getDashboardSummary(UserPrincipal principal, int month, int year) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User matrix reference context missing."));

        BigDecimal totalIncome = incomeRepository.sumIncomeByUserAndMonth(user, month, year);
        BigDecimal totalExpense = expenseRepository.sumExpenseByUserIdAndMonth(user.getUserId(), month, year);
        BigDecimal incomeVal = totalIncome != null ? totalIncome : BigDecimal.ZERO;
        BigDecimal expenseVal = totalExpense != null ? totalExpense : BigDecimal.ZERO;
        BigDecimal netSavings = incomeVal.subtract(expenseVal);

        return DashboardSummaryResponse.builder()
                .totalIncome(incomeVal)
                .totalExpense(expenseVal)
                .netSavings(netSavings)
                .targetMonth(month)
                .targetYear(year)
                .build();
    }
}