package com.finsightai.finsight_ai_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long notificationId;
    private String title;
    private String message;
    private String type; // e.g., BUDGET_ALERT, GOAL_UPDATE, SYSTEM
    private boolean read;
    private LocalDateTime createdAt;
}