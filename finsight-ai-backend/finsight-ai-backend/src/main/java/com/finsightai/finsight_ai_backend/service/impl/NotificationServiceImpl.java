package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.dto.response.NotificationResponse;
import com.finsightai.finsight_ai_backend.entity.Notification;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.exception.ResourceNotFoundException;
import com.finsightai.finsight_ai_backend.repository.NotificationRepository;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public NotificationResponse createNotification(User user, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setUser(user);

        Notification savedNotification = notificationRepository.save(notification);
        return mapToResponse(savedNotification);
    }

    @Override
    public List<NotificationResponse> getAllNotifications(UserPrincipal principal) {
        User user = fetchCurrentUser(principal);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponse> getNotificationsByReadStatus(UserPrincipal principal, boolean read) {
        User user = fetchCurrentUser(principal);
        return notificationRepository.findByUserAndReadOrderByCreatedAtDesc(user, read)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(UserPrincipal principal) {
        User user = fetchCurrentUser(principal);
        return notificationRepository.countByUserAndRead(user, false);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, UserPrincipal principal) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        validateOwnership(notification, principal);
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(UserPrincipal principal) {
        User user = fetchCurrentUser(principal);
        notificationRepository.markAllAsRead(user);
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId, UserPrincipal principal) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        validateOwnership(notification, principal);
        notificationRepository.delete(notification);
    }

    private User fetchCurrentUser(UserPrincipal principal) {
        return userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User record context instance missing in database logic."));
    }

    private void validateOwnership(Notification notification, UserPrincipal principal) {
        if (!notification.getUser().getUserId().equals(principal.getUserId())) {
            throw new AccessDeniedException("You do not have permission to access this notification");
        }
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .notificationId(notification.getNotificationId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}