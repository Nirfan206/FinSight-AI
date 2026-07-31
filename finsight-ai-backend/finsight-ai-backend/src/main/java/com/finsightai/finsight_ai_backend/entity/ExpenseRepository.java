package com.finsightai.finsight_ai_backend.repository;

import com.finsightai.finsight_ai_backend.entity.Expense;
import com.finsightai.finsight_ai_backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    /**
     * Finds all expense records for a specific user with full pagination support.
     */
    Page<Expense> findByUser(User user, Pageable pageable);

    /**
     * Retrieves a user's expense entries within a precise date window for reporting.
     */
    List<Expense> findByUserAndRecordDateBetween(User user, LocalDate startDate, LocalDate endDate);

    /**
     * Sums up total expenditures for a user within a specific month and year.
     * Coalesces null values to zero to avoid arithmetic issues.
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
            "WHERE e.user = :user " +
            "AND FUNCTION('MONTH', e.recordDate) = :month " +
            "AND FUNCTION('YEAR', e.recordDate) = :year")
    BigDecimal sumExpenseByUserAndMonth(@Param("user") User user, @Param("month") int month, @Param("year") int year);

    /**
     * Sums up total expenditures for a user within a specific category, month, and year.
     * Useful for checking real-time budget threshold overruns.
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
            "WHERE e.user = :user " +
            "AND e.category = :category " +
            "AND FUNCTION('MONTH', e.recordDate) = :month " +
            "AND FUNCTION('YEAR', e.recordDate) = :year")
    BigDecimal sumExpenseByUserAndCategoryAndMonth(@Param("user") User user,
                                                   @Param("category") String category,
                                                   @Param("month") int month,
                                                   @Param("year") int year);
}