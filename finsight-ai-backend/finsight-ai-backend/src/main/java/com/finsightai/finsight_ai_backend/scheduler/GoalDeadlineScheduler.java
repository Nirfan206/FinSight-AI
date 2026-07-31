package com.finsightai.finsight_ai_backend.scheduler;

import com.finsightai.finsight_ai_backend.entity.FinancialGoal;
import com.finsightai.finsight_ai_backend.repository.FinancialGoalRepository;
import com.finsightai.finsight_ai_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class GoalDeadlineScheduler {

    private final FinancialGoalRepository financialGoalRepository;
    private final NotificationService notificationService;

    /**
     * Runs automatically every single day at midnight (00:00:00) to find goals
     * that have passed their deadline target date without reaching their required amount.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void processOverdueGoals() {
        log.info("Starting automated background sweep for overdue financial goals...");

        LocalDate today = LocalDate.now();

        // Custom repository query finding all active "IN_PROGRESS" goals where target date is strictly before today
        List<FinancialGoal> overdueGoals = financialGoalRepository.findOverdueGoalsGlobally(today);

        if (overdueGoals.isEmpty()) {
            log.info("Automated sweep complete: No overdue milestones found.");
            return;
        }

        log.info("Found {} overdue goals. Initiating state adjustments and alert dispatch...", overdueGoals.size());

        for (FinancialGoal goal : overdueGoals) {
            goal.setStatus("FAILED");
            financialGoalRepository.save(goal);

            // Directly dispatches the persistent notification trigger to the user database reference
            notificationService.createNotification(
                    goal.getUser(),
                    "Goal Deadline Missed",
                    String.format("Your target date for '%s' has passed without meeting the target amount.", goal.getGoalName()),
                    "GOAL_UPDATE"
            );
        }

        log.info("Successfully updated state parameters and sent alerts for all {} overdue goals.", overdueGoals.size());
    }
}