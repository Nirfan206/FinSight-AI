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

    // Using standardized native queries so MySQL handles the date parsing directly
    @Query(value = "SELECT SUM(e.amount) FROM expenses e WHERE e.user_id = :#{#user.userId} AND MONTH(e.record_date) = :month AND YEAR(e.record_date) = :year", nativeQuery = true)
    BigDecimal sumExpenseByUserAndMonth(@Param("user") User user, @Param("month") int month, @Param("year") int year);

    @Query(value = "SELECT SUM(e.amount) FROM expenses e WHERE e.user_id = :#{#user.userId} AND e.category = :category AND MONTH(e.record_date) = :month AND YEAR(e.record_date) = :year", nativeQuery = true)
    BigDecimal sumExpenseByUserAndCategoryAndMonth(@Param("user") User user, @Param("category") String category, @Param("month") int month, @Param("year") int year);
}