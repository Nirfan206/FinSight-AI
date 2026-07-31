package com.finsightai.finsight_ai_backend.repository;

import com.finsightai.finsight_ai_backend.entity.Budget;
import com.finsightai.finsight_ai_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    /**
     * Finds all budget constraints configured for a user within a target monthly cycle.
     */
    List<Budget> findByUserAndBudgetMonthAndBudgetYear(User user, int budgetMonth, int budgetYear);

    /**
     * Locates a precise single category budget constraint for structural deduplication checks.
     */
    Optional<Budget> findByUserAndCategoryAndBudgetMonthAndBudgetYear(User user, String category, int budgetMonth, int budgetYear);
}