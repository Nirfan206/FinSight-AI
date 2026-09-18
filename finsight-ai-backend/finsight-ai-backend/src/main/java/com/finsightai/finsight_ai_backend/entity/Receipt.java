package com.finsightai.finsight_ai_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "receipts", indexes = {
        @Index(name = "idx_receipt_user", columnList = "user_id"),
        @Index(name = "idx_receipt_expense", columnList = "expense_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receipt extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receipt_id")
    private Long receiptId;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "upload_date", insertable = false, updatable = false)
    private LocalDateTime uploadDate; // Managed automatically via MySQL DEFAULT_GENERATED

    @Column(name = "expense_id")
    private Long expenseId; // Optional foreign reference anchor link

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}