package com.finsightai.finsight_ai_backend.repository;

import com.finsightai.finsight_ai_backend.entity.FinancialGoal;
import com.finsightai.finsight_ai_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinancialGoalRepository extends JpaRepository<FinancialGoal, Long> {

    List<FinancialGoal> findByUser(User user);

    List<FinancialGoal> findByUserAndStatus(User user, String status);

    /**
     * Finds all active goals across the entire system that have passed their deadline date.
     */
    @Query("SELECT g FROM FinancialGoal g WHERE g.status = 'IN_PROGRESS' AND g.targetDate < :date")
    List<FinancialGoal> findOverdueGoalsGlobally(@Param("date") LocalDate date);
}