package com.finsightai.finsight_ai_backend.repository;

import com.finsightai.finsight_ai_backend.entity.Income;
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
public interface IncomeRepository extends JpaRepository<Income, Long> {

    /**
     * Finds all income records for a specific user with full pagination support.
     */
    Page<Income> findByUser(User user, Pageable pageable);

    /**
     * Retrieves a user's income entries within a precise date window.
     */
    List<Income> findByUserAndRecordDateBetween(User user, LocalDate startDate, LocalDate endDate);

    /**
     * Sums up total incoming revenue for a user within a specific month and year.
     * Coalesces null values to zero to guarantee clean math executions.
     */
    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i " +
            "WHERE i.user = :user " +
            "AND FUNCTION('MONTH', i.recordDate) = :month " +
            "AND FUNCTION('YEAR', i.recordDate) = :year")
    BigDecimal sumIncomeByUserAndMonth(@Param("user") User user, @Param("month") int month, @Param("year") int year);
}