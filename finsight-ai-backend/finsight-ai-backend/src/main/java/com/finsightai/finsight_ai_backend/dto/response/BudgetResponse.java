package com.finsightai.finsight_ai_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {

    private Long budgetId;
    private String category;
    private BigDecimal monthlyLimit;
    private int budgetMonth;
    private int budgetYear;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}