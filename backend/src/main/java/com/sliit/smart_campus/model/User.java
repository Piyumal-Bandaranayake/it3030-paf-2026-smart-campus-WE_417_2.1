package com.sliit.smart_campus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    private String role;
    private String provider;
    private String profilePicture;
    private String status; // Added status field
    private LocalDateTime createdAt;

    // No-args constructor
    public User() {}

    // All-args constructor
    public User(String id, String name, String email, String role, String provider, String profilePicture, String status, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.provider = provider;
        this.profilePicture = profilePicture;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getProvider() { return provider; }
    public String getProfilePicture() { return profilePicture; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
    public void setProvider(String provider) { this.provider = provider; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    public void setStatus(String status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String name;
        private String email;
        private String role;
        private String provider;
        private String profilePicture;
        private String status;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder provider(String provider) { this.provider = provider; return this; }
        public Builder profilePicture(String profilePicture) { this.profilePicture = profilePicture; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, name, email, role, provider, profilePicture, status, createdAt);
        }
    }

    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "', email='" + email + "', role='" + role + "'}";
    }
}
