package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.dto.request.FinancialGoalRequest;
import com.finsightai.finsight_ai_backend.dto.response.FinancialGoalResponse;
import com.finsightai.finsight_ai_backend.entity.FinancialGoal;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.exception.ResourceNotFoundException;
import com.finsightai.finsight_ai_backend.repository.FinancialGoalRepository;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.FinancialGoalService;
import com.finsightai.finsight_ai_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinancialGoalServiceImpl implements FinancialGoalService {

    private final FinancialGoalRepository financialGoalRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public FinancialGoalResponse createGoal(FinancialGoalRequest request, UserPrincipal principal) {
        User user = fetchCurrentUser(principal);

        FinancialGoal goal = new FinancialGoal();
        goal.setGoalName(request.getGoalName());
        goal.setTargetAmount(request.getTargetAmount());
        //goal.setCurrentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO);
        goal.setCurrentAmount(
                request.getCurrentAmount() != null
                        ? request.getCurrentAmount()
                        : BigDecimal.ZERO
        );
        goal.setTargetDate(request.getTargetDate());
        goal.setStatus("IN_PROGRESS");
        goal.setUser(user);

        evaluateGoalStatus(goal);

        FinancialGoal savedGoal = financialGoalRepository.save(goal);
        return mapToResponse(savedGoal);
    }

    @Override
    @Transactional
    public FinancialGoalResponse updateGoal(Long goalId, FinancialGoalRequest request, UserPrincipal principal) {
        FinancialGoal goal = financialGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Financial goal not found with id: " + goalId));

        validateOwnership(goal, principal);

        goal.setGoalName(request.getGoalName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount());
        goal.setTargetDate(request.getTargetDate());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            goal.setStatus(request.getStatus());
        } else {
            evaluateGoalStatus(goal);
        }

        FinancialGoal updatedGoal = financialGoalRepository.save(goal);
        return mapToResponse(updatedGoal);
    }

    @Override
    @Transactional
    public FinancialGoalResponse addContribution(Long goalId, BigDecimal amount, UserPrincipal principal) {
        User user = fetchCurrentUser(principal);
        FinancialGoal goal = financialGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Financial goal not found with id: " + goalId));

        validateOwnership(goal, principal);

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Contribution amount must be greater than zero");
        }

        BigDecimal existingAmount = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : BigDecimal.ZERO;
        goal.setCurrentAmount(existingAmount.add(amount));

        String previousStatus = goal.getStatus();
        evaluateGoalStatus(goal);

        if ("IN_PROGRESS".equals(previousStatus) && "ACHIEVED".equals(goal.getStatus())) {
            notificationService.createNotification(
                    user,
                    "Goal Achieved! 🎉",
                    String.format("Congratulations! You've fully reached your goal: %s", goal.getGoalName()),
                    "GOAL_UPDATE"
            );
        }

        FinancialGoal updatedGoal = financialGoalRepository.save(goal);
        return mapToResponse(updatedGoal);
    }

    @Override
    public FinancialGoalResponse getGoalById(Long goalId, UserPrincipal principal) {
        FinancialGoal goal = financialGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Financial goal not found with id: " + goalId));

        validateOwnership(goal, principal);
        return mapToResponse(goal);
    }

    @Override
    public List<FinancialGoalResponse> getAllGoals(UserPrincipal principal) {
        User user = fetchCurrentUser(principal);
        return financialGoalRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FinancialGoalResponse> getGoalsByStatus(UserPrincipal principal, String status) {
        User user = fetchCurrentUser(principal);
        return financialGoalRepository.findByUserAndStatus(user, status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteGoal(Long goalId, UserPrincipal principal) {
        FinancialGoal goal = financialGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Financial goal not found with id: " + goalId));

        validateOwnership(goal, principal);
        financialGoalRepository.delete(goal);
    }

    @Override
    @Transactional
    public void checkAndProcessOverdueGoals(UserPrincipal principal) {
        List<FinancialGoal> overdueGoals = financialGoalRepository.findOverdueGoalsGlobally(LocalDate.now());

        for (FinancialGoal goal : overdueGoals) {
            goal.setStatus("FAILED");
            financialGoalRepository.save(goal);

            notificationService.createNotification(
                    goal.getUser(),
                    "Goal Deadline Missed",
                    String.format("Your target date for '%s' has passed without meeting the target amount.", goal.getGoalName()),
                    "GOAL_UPDATE"
            );
        }
    }

    private User fetchCurrentUser(UserPrincipal principal) {
        return userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User identity matrix record not found inside context."));
    }

    private void evaluateGoalStatus(FinancialGoal goal) {
        BigDecimal current = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : BigDecimal.ZERO;

        if (current.compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("ACHIEVED");
        } else if (goal.getTargetDate().isBefore(LocalDate.now()) && !"ACHIEVED".equals(goal.getStatus())) {
            goal.setStatus("FAILED");
        } else if ("FAILED".equals(goal.getStatus()) && goal.getTargetDate().isAfter(LocalDate.now())) {
            goal.setStatus("IN_PROGRESS");
        }
    }

    private void validateOwnership(FinancialGoal goal, UserPrincipal principal) {
        if (!goal.getUser().getUserId().equals(principal.getUserId())) {
            throw new AccessDeniedException("You do not have permission to access this financial goal");
        }
    }

    private FinancialGoalResponse mapToResponse(FinancialGoal goal) {
        return FinancialGoalResponse.builder()
                .goalId(goal.getGoalId())
                .goalName(goal.getGoalName())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .targetDate(goal.getTargetDate())
                .status(goal.getStatus())
                .createdAt(goal.getCreatedAt())
                .updatedAt(goal.getUpdatedAt())
                .build();
    }
}