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

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications(@RequestParam(required = false) Boolean unreadOnly) {
        if (unreadOnly != null && unreadOnly) {
            return ResponseEntity.ok(notificationRepository.findByReadOrderByCreatedAtDesc(false));
        }
        return ResponseEntity.ok(notificationRepository.findByOrderByCreatedAtDesc());
    }

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

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        List<Notification> unread = notificationRepository.findByReadOrderByCreatedAtDesc(false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllNotifications() {
        notificationRepository.deleteAll();
        return ResponseEntity.ok().build();
    }
}
