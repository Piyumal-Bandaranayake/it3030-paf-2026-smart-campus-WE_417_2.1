package com.sliit.smart_campus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String type;       // TICKET, REGISTRATION, BOOKING, TICKET_UPDATE, BOOKING_UPDATE
    private String title;
    private String message;
    private String targetId;   // ID of the related entity
    private String targetEmail; // null = admin-wide; set = user-specific
    private boolean read = false;
    private LocalDateTime createdAt;

    public Notification() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructor for admin-wide notifications (no targetEmail)
    public Notification(String type, String title, String message, String targetId) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.targetId = targetId;
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }

    // Constructor for user-specific notifications
    public Notification(String type, String title, String message, String targetId, String targetEmail) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.targetId = targetId;
        this.targetEmail = targetEmail;
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public String getTargetEmail() { return targetEmail; }
    public void setTargetEmail(String targetEmail) { this.targetEmail = targetEmail; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
