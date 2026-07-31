package com.finsightai.finsight_ai_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "incomes", indexes = {
        @Index(name = "idx_income_user", columnList = "user_id"),
        @Index(name = "idx_income_date", columnList = "record_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
public class Income extends FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "income_id")
    private Long incomeId;

    @Column(nullable = false, length = 100)
    private String source; // e.g., Salary, Freelance, Investments
}