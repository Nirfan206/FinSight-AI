package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.dto.request.ExpenseRequest;
import com.finsightai.finsight_ai_backend.dto.response.ExpenseResponse;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {

    ExpenseResponse createExpense(ExpenseRequest request, UserPrincipal principal);

    ExpenseResponse updateExpense(Long expenseId, ExpenseRequest request, UserPrincipal principal);

    ExpenseResponse getExpenseById(Long expenseId, UserPrincipal principal);

    Page<ExpenseResponse> getAllExpenses(UserPrincipal principal, Pageable pageable);

    List<ExpenseResponse> getExpensesByDateRange(UserPrincipal principal, LocalDate startDate, LocalDate endDate);

    void deleteExpense(Long expenseId, UserPrincipal principal);

    BigDecimal getTotalExpenseByMonth(UserPrincipal principal, int month, int year);

    BigDecimal getTotalExpenseByCategoryAndMonth(UserPrincipal principal, String category, int month, int year);
}