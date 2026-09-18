package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.dto.request.BudgetRequest;
import com.finsightai.finsight_ai_backend.dto.response.BudgetResponse;
import com.finsightai.finsight_ai_backend.entity.Budget;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.exception.ResourceNotFoundException;
import com.finsightai.finsight_ai_backend.repository.BudgetRepository;
import com.finsightai.finsight_ai_backend.repository.ExpenseRepository;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.BudgetService;
import com.finsightai.finsight_ai_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetServiceImpl implements BudgetService {

    // Change this line:
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public BudgetResponse createOrUpdateBudget(BudgetRequest request, UserPrincipal principal) {
        User user = fetchCurrentUser(principal);

        Optional<Budget> existingBudget = budgetRepository.findByUserAndCategoryAndBudgetMonthAndBudgetYear(
                user, request.getCategory(), request.getBudgetMonth(), request.getBudgetYear());

        Budget budget;
        if (existingBudget.isPresent()) {
            budget = existingBudget.get();
            budget.setMonthlyLimit(request.getMonthlyLimit());
        } else {
            budget = Budget.builder()
                    .category(request.getCategory())
                    .monthlyLimit(request.getMonthlyLimit())
                    .budgetMonth(request.getBudgetMonth())
                    .budgetYear(request.getBudgetYear())
                    .user(user)
                    .build();
        }

        Budget savedBudget = budgetRepository.save(budget);

        checkBudgetThresholds(user, savedBudget.getCategory(), savedBudget.getBudgetMonth(), savedBudget.getBudgetYear());

        return mapToResponse(savedBudget);
    }

    @Override
    public BudgetResponse getBudgetById(Long budgetId, UserPrincipal principal) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));

        validateOwnership(budget, principal);
        return mapToResponse(budget);
    }

    @Override
    public List<BudgetResponse> getBudgetsByPeriod(UserPrincipal principal, int month, int year) {
        User user = fetchCurrentUser(principal);
        return budgetRepository.findByUserAndBudgetMonthAndBudgetYear(user, month, year)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteBudget(Long budgetId, UserPrincipal principal) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));

        validateOwnership(budget, principal);
        budgetRepository.delete(budget);
    }

    @Override
    @Transactional
    public void checkBudgetThresholds(User user, String category, int month, int year) {
        Optional<Budget> budgetOpt = budgetRepository.findByUserAndCategoryAndBudgetMonthAndBudgetYear(user, category, month, year);
        if (budgetOpt.isEmpty()) {
            return;
        }

        Budget budget = budgetOpt.get();
        BigDecimal limit = budget.getMonthlyLimit();

        //BigDecimal currentSpend = expenseRepository.sumExpenseByUserAndCategoryAndMonth(user.getUserId(), category, month, year);
        BigDecimal currentSpend = expenseRepository.sumExpenseByUserIdAndCategoryAndMonth(user.getUserId(), category, month, year);
        if (currentSpend == null || currentSpend.compareTo(BigDecimal.ZERO) <= 0 || limit.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        BigDecimal ratio = currentSpend.divide(limit, 4, RoundingMode.HALF_UP);

        if (ratio.compareTo(BigDecimal.ONE) >= 0) {
            notificationService.createNotification(
                    user,
                    "Budget Limit Exceeded!",
                    String.format("You have exceeded your monthly limit for %s. Spent: $%s / Budget: $%s", category, currentSpend, limit),
                    "BUDGET_ALERT"
            );
        } else if (ratio.compareTo(new BigDecimal("0.80")) >= 0) {
            notificationService.createNotification(
                    user,
                    "Budget Warning (80%)",
                    String.format("You have consumed over 80%% of your monthly budget for %s. Spent: $%s / Budget: $%s", category, currentSpend, limit),
                    "BUDGET_ALERT"
            );
        }
    }

    private User fetchCurrentUser(UserPrincipal principal) {
        return userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User identity reference not found inside backend context."));
    }

    private void validateOwnership(Budget budget, UserPrincipal principal) {
        if (!budget.getUser().getUserId().equals(principal.getUserId())) {
            throw new AccessDeniedException("You do not have permission to access this budget configuration");
        }
    }

    private BudgetResponse mapToResponse(Budget budget) {
        return BudgetResponse.builder()
                .budgetId(budget.getBudgetId())
                .category(budget.getCategory())
                .monthlyLimit(budget.getMonthlyLimit())
                .budgetMonth(budget.getBudgetMonth())
                .budgetYear(budget.getBudgetYear())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }
}