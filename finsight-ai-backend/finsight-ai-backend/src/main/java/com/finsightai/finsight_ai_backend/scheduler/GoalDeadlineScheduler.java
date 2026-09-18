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

@Slf4j
@Component
@RequiredArgsConstructor
public class GoalDeadlineScheduler {

    private final FinancialGoalRepository financialGoalRepository;
    private final NotificationService notificationService;

    /**
     * Runs every day at 12:00 AM.
     * Finds overdue financial goals, marks them as FAILED,
     * and sends a notification to the respective user.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void processOverdueGoals() {

        log.info("========== Goal Deadline Scheduler Started ==========");

        LocalDate today = LocalDate.now();

        List<FinancialGoal> overdueGoals =
                financialGoalRepository.findOverdueGoalsGlobally(today);

        if (overdueGoals.isEmpty()) {
            log.info("No overdue financial goals found.");
            return;
        }

        log.info("Found {} overdue financial goal(s).", overdueGoals.size());

        for (FinancialGoal goal : overdueGoals) {

            try {

                goal.setStatus("FAILED");

                notificationService.createNotification(
                        goal.getUser(),
                        "Goal Deadline Missed",
                        String.format(
                                "Your financial goal '%s' has passed its target date without reaching the target amount.",
                                goal.getGoalName()
                        ),
                        "GOAL_UPDATE"
                );

                log.info(
                        "Processed overdue goal '{}' for user '{}'.",
                        goal.getGoalName(),
                        goal.getUser().getEmail()
                );

            } catch (Exception ex) {

                log.error(
                        "Failed to process financial goal ID {}",
                        goal.getGoalId(),
                        ex
                );
            }
        }

        financialGoalRepository.saveAll(overdueGoals);

        log.info(
                "Goal Deadline Scheduler completed successfully. {} goal(s) updated.",
                overdueGoals.size()
        );
    }
}