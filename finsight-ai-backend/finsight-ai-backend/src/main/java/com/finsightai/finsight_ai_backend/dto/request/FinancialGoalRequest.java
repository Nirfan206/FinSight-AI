package com.finsightai.finsight_ai_backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialGoalRequest {

    @NotBlank(message = "Goal name is required")
    @Size(max = 100, message = "Goal name cannot exceed 100 characters")
    private String goalName;

    @NotNull(message = "Target amount is required")
    @DecimalMin(value = "0.01", message = "Target amount must be greater than zero")
    private BigDecimal targetAmount;

    @NotNull(message = "Current amount is required")
    @DecimalMin(value = "0.00", message = "Current amount cannot be negative")
    private BigDecimal currentAmount = BigDecimal.ZERO;

    @NotNull(message = "Target date is required")
    private LocalDate targetDate;

    @Size(max = 20, message = "Status cannot exceed 20 characters")
    private String status = "IN_PROGRESS";
}