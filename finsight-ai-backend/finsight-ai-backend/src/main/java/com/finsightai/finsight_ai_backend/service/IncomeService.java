package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.dto.request.IncomeRequest;
import com.finsightai.finsight_ai_backend.dto.response.IncomeResponse;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IncomeService {

    /**
     * Records a new income entry for the authenticated principal thread context.
     */
    IncomeResponse createIncome(IncomeRequest request, UserPrincipal principal);

    /**
     * Updates an existing income record if it belongs to the authenticated user.
     */
    IncomeResponse updateIncome(Long incomeId, IncomeRequest request, UserPrincipal principal);

    /**
     * Retrieves a single income record by its unique ID.
     */
    IncomeResponse getIncomeById(Long incomeId, UserPrincipal principal);

    /**
     * Fetches a paginated list of all income entries for the user workspace.
     */
    Page<IncomeResponse> getAllIncomes(UserPrincipal principal, Pageable pageable);

    /**
     * Retrieves income entries within a specific historical window for data reporting.
     */
    List<IncomeResponse> getIncomesByDateRange(UserPrincipal principal, LocalDate startDate, LocalDate endDate);

    /**
     * Deletes an income record securely from the partition space.
     */
    void deleteIncome(Long incomeId, UserPrincipal principal);

    /**
     * Calculates the total revenue generated during a single monthly tracking cycle.
     */
    BigDecimal getTotalIncomeByMonth(UserPrincipal principal, int month, int year);
}