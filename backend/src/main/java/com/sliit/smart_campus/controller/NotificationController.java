package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.model.Notification;
import com.sliit.smart_campus.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // ── Admin: get all global notifications (no targetEmail) ──────────────────
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications(@RequestParam(required = false) Boolean unreadOnly) {
        if (unreadOnly != null && unreadOnly) {
            return ResponseEntity.ok(notificationRepository.findByReadOrderByCreatedAtDesc(false));
        }
        return ResponseEntity.ok(notificationRepository.findByTargetEmailIsNullOrderByCreatedAtDesc());
    }

    // ── User: get notifications for a specific user ───────────────────────────
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable String email,
            @RequestParam(required = false) Boolean unreadOnly) {
        if (unreadOnly != null && unreadOnly) {
            return ResponseEntity.ok(
                notificationRepository.findByTargetEmailAndReadOrderByCreatedAtDesc(email, false));
        }
        return ResponseEntity.ok(
            notificationRepository.findByTargetEmailOrderByCreatedAtDesc(email));
    }

    // ── Mark a single notification as read ────────────────────────────────────
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setRead(true);
                    notificationRepository.save(notification);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Mark all admin notifications as read ─────────────────────────────────
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        List<Notification> unread = notificationRepository.findByReadOrderByCreatedAtDesc(false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }

    // ── Mark all notifications as read for a specific user ───────────────────
    @PutMapping("/user/{email}/read-all")
    public ResponseEntity<?> markAllUserNotificationsAsRead(@PathVariable String email) {
        List<Notification> unread = notificationRepository
                .findByTargetEmailAndReadOrderByCreatedAtDesc(email, false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }

    // ── Delete a single notification ─────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ── Delete all admin notifications ───────────────────────────────────────
    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllNotifications() {
        List<Notification> adminNotifs = notificationRepository.findByTargetEmailIsNullOrderByCreatedAtDesc();
        notificationRepository.deleteAll(adminNotifs);
        return ResponseEntity.ok().build();
    }

    // ── Delete all notifications for a specific user ─────────────────────────
    @DeleteMapping("/user/{email}/all")
    public ResponseEntity<?> deleteAllUserNotifications(@PathVariable String email) {
        notificationRepository.deleteByTargetEmail(email);
        return ResponseEntity.ok().build();
    }
}
