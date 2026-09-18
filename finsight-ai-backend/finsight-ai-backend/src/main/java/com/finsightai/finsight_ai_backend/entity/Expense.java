package com.finsightai.finsight_ai_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

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
@AttributeOverride(name = "recordDate", column = @Column(name = "record_date", nullable = false))
public class Expense extends FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expense_id")
    private Long expenseId;

    @Column(nullable = false, length = 100)
    private String merchant; // e.g., Amazon, Walmart, Uber

    @Column(name = "receipt_url", length = 512)
    private String receiptUrl; // Managed seamlessly via future AWS S3 configurations

    // Maps the redundant physical MySQL column constraint safely
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    // Overridden setter to populate both mandatory physical date columns simultaneously
    @Override
    public void setRecordDate(LocalDate recordDate) {
        super.setRecordDate(recordDate);
        this.expenseDate = recordDate;
    }
}