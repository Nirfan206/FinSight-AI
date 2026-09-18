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

    Page<Expense> findByUser(User user, Pageable pageable);

    List<Expense> findByUserAndRecordDateBetween(User user, LocalDate startDate, LocalDate endDate);

    // Optimized: Uses flat userId parameter binding instead of SpEL entity parsing to improve transactional safety
    @Query(value = "SELECT SUM(e.amount) FROM expenses e WHERE e.user_id = :userId AND MONTH(e.record_date) = :month AND YEAR(e.record_date) = :year", nativeQuery = true)
    BigDecimal sumExpenseByUserIdAndMonth(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    @Query(value = "SELECT SUM(e.amount) FROM expenses e WHERE e.user_id = :userId AND e.category = :category AND MONTH(e.record_date) = :month AND YEAR(e.record_date) = :year", nativeQuery = true)
    BigDecimal sumExpenseByUserIdAndCategoryAndMonth(@Param("userId") Long userId, @Param("category") String category, @Param("month") int month, @Param("year") int year);
}