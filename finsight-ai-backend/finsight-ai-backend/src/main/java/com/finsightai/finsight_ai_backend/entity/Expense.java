package com.finsightai.finsight_ai_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "expenses", indexes = {
        @Index(name = "idx_expense_user", columnList = "user_id"),
        @Index(name = "idx_expense_date", columnList = "record_date"),
        @Index(name = "idx_expense_category", columnList = "category")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
public class Expense extends FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expense_id")
    private Long expenseId;

    @Column(nullable = false, length = 100)
    private String merchant; // e.g., Amazon, Walmart, Uber

    @Column(name = "receipt_url", length = 512)
    private String receiptUrl; // Managed seamlessly via future AWS S3 configurations
}