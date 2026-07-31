package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.dto.request.ExpenseRequest;
import com.finsightai.finsight_ai_backend.dto.response.ExpenseResponse;
import com.finsightai.finsight_ai_backend.entity.Expense;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.exception.ResourceNotFoundException;
import com.finsightai.finsight_ai_backend.repository.ExpenseRepository;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.BudgetService;
import com.finsightai.finsight_ai_backend.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final BudgetService budgetService;

    @Override
    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest request, UserPrincipal principal) {
        User user = fetchCurrentUser(principal);

        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setMerchant(request.getMerchant());
        expense.setDescription(request.getDescription());
        expense.setRecordDate(request.getRecordDate());
        expense.setReceiptUrl(request.getReceiptUrl());
        expense.setUser(user);

        Expense savedExpense = expenseRepository.save(expense);

        // Defensively protect the transaction against uninitialized budget limits
        try {
            budgetService.checkBudgetThresholds(
                    user,
                    savedExpense.getCategory(),
                    savedExpense.getRecordDate().getMonthValue(),
                    savedExpense.getRecordDate().getYear()
            );
        } catch (Exception e) {
            log.warn("Budget thresholds assessment skipped or not configured for this sector: {}", e.getMessage());
        }

        return mapToResponse(savedExpense);
    }

    @Override
    @Transactional
    public ExpenseResponse updateExpense(Long expenseId, ExpenseRequest request, UserPrincipal principal) {
        User user = fetchCurrentUser(principal);
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + expenseId));

        validateOwnership(expense, principal);

        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setMerchant(request.getMerchant());
        expense.setDescription(request.getDescription());
        expense.setRecordDate(request.getRecordDate());
        expense.setReceiptUrl(request.getReceiptUrl());

        Expense updatedExpense = expenseRepository.save(expense);

        try {
            budgetService.checkBudgetThresholds(
                    user,
                    updatedExpense.getCategory(),
                    updatedExpense.getRecordDate().getMonthValue(),
                    updatedExpense.getRecordDate().getYear()
            );
        } catch (Exception e) {
            log.warn("Budget thresholds update skipped: {}", e.getMessage());
        }

        return mapToResponse(updatedExpense);
    }

    @Override
    public ExpenseResponse getExpenseById(Long expenseId, UserPrincipal principal) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + expenseId));

        validateOwnership(expense, principal);
        return mapToResponse(expense);
    }

    @Override
    public Page<ExpenseResponse> getAllExpenses(UserPrincipal principal, Pageable pageable) {
        User user = fetchCurrentUser(principal);
        return expenseRepository.findByUser(user, pageable).map(this::mapToResponse);
    }

    @Override
    public List<ExpenseResponse> getExpensesByDateRange(UserPrincipal principal, LocalDate startDate, LocalDate endDate) {
        User user = fetchCurrentUser(principal);
        return expenseRepository.findByUserAndRecordDateBetween(user, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteExpense(Long expenseId, UserPrincipal principal) {
        User user = fetchCurrentUser(principal);
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + expenseId));

        validateOwnership(expense, principal);

        String category = expense.getCategory();
        int month = expense.getRecordDate().getMonthValue();
        int year = expense.getRecordDate().getYear();

        expenseRepository.delete(expense);

        try {
            budgetService.checkBudgetThresholds(user, category, month, year);
        } catch (Exception e) {
            log.warn("Budget thresholds clearing configuration skipped: {}", e.getMessage());
        }
    }

    @Override
    public BigDecimal getTotalExpenseByMonth(UserPrincipal principal, int month, int year) {
        User user = fetchCurrentUser(principal);
        BigDecimal total = expenseRepository.sumExpenseByUserAndMonth(user, month, year);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal getTotalExpenseByCategoryAndMonth(UserPrincipal principal, String category, int month, int year) {
        User user = fetchCurrentUser(principal);
        BigDecimal total = expenseRepository.sumExpenseByUserAndCategoryAndMonth(user, category, month, year);
        return total != null ? total : BigDecimal.ZERO;
    }

    private User fetchCurrentUser(UserPrincipal principal) {
        return userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User identity reference not found inside system matrix."));
    }

    private void validateOwnership(Expense expense, UserPrincipal principal) {
        if (!expense.getUser().getUserId().equals(principal.getUserId())) {
            throw new AccessDeniedException("Access denied. Resource modification forbidden on this identity instance.");
        }
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .expenseId(expense.getExpenseId())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .merchant(expense.getMerchant())
                .description(expense.getDescription())
                .recordDate(expense.getRecordDate())
                .receiptUrl(expense.getReceiptUrl())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }
}