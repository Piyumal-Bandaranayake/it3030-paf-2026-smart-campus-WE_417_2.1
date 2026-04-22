package com.sliit.smart_campus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;
    private String ticketId;
    private String userEmail;
    private String userName;
    private String userProfilePicture;
    private String text;
    private LocalDateTime createdAt;

    public Comment() {}

    public Comment(String ticketId, String userEmail, String userName, String userProfilePicture, String text) {
        this.ticketId = ticketId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.userProfilePicture = userProfilePicture;
        this.text = text;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserProfilePicture() { return userProfilePicture; }
    public void setUserProfilePicture(String userProfilePicture) { this.userProfilePicture = userProfilePicture; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
