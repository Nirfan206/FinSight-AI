package com.finsightai.finsight_ai_backend.repository;

import com.finsightai.finsight_ai_backend.entity.Notification;
import com.finsightai.finsight_ai_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Finds notifications for a specific user ordered by newest first.
     */
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Finds only read or unread notifications for a specific user.
     */
    List<Notification> findByUserAndReadOrderByCreatedAtDesc(User user, boolean read);

    /**
     * Counts the number of pending unread alerts for the dashboard badge.
     */
    long countByUserAndRead(User user, boolean read);

    /**
     * Bulk updates all unread notifications to read status for the user.
     */
    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.user = :user AND n.read = false")
    void markAllAsRead(@Param("user") User user);
}