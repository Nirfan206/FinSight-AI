package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.dto.response.NotificationResponse;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;

import java.util.List;

public interface NotificationService {

    /**
     * Creates and dispatches a new system notification to a specific user database model.
     * Kept with raw 'User' parameter to support internal automated calls from background engines.
     */
    NotificationResponse createNotification(User user, String title, String message, String type);

    /**
     * Retrieves all notifications for the authenticated user principal, sorted by newest first.
     */
    List<NotificationResponse> getAllNotifications(UserPrincipal principal);

    /**
     * Retrieves only unread or read notifications for the user principal.
     */
    List<NotificationResponse> getNotificationsByReadStatus(UserPrincipal principal, boolean read);

    /**
     * Counts the total number of unread alerts remaining for the dashboard badge indicator.
     */
    long getUnreadCount(UserPrincipal principal);

    /**
     * Marks a single specific notification as read.
     */
    void markAsRead(Long notificationId, UserPrincipal principal);

    /**
     * Bulk updates all pending notifications to read status for the user principal.
     */
    void markAllAsRead(UserPrincipal principal);

    /**
     * Deletes a specific notification from the system partition.
     */
    void deleteNotification(Long notificationId, UserPrincipal principal);
}