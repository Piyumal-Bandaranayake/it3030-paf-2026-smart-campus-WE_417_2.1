package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.model.Notification;
import com.sliit.smart_campus.model.User;
import com.sliit.smart_campus.repository.NotificationRepository;
import com.sliit.smart_campus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(userRepository.findByRole(role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("")
    public ResponseEntity<?> createOrUpdateUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        String normalizedEmail = user.getEmail().trim().toLowerCase();
        
        return userRepository.findByEmail(normalizedEmail)
            .map(existingUser -> {
                // Update existing user's role
                existingUser.setRole(user.getRole() != null ? user.getRole() : "USER");
                if (user.getPhone() != null) existingUser.setPhone(user.getPhone());
                if (user.getName() != null) existingUser.setName(user.getName());
                userRepository.save(existingUser);
                return ResponseEntity.ok(existingUser);
            })
            .orElseGet(() -> {
                // Create new user
                user.setEmail(normalizedEmail);
                user.setStatus("Active");
                user.setCreatedAt(LocalDateTime.now());
                if (user.getRole() == null) user.setRole("USER");
                User savedUser = userRepository.save(user);

                // Create Notification for Admin
                Notification notification = new Notification(
                    "REGISTRATION",
                    "New User Registration",
                    "A new user (" + savedUser.getName() + " - " + savedUser.getEmail() + ") has joined the system.",
                    savedUser.getId()
                );
                notificationRepository.save(notification);

                return ResponseEntity.status(201).body(savedUser);
            });
    }
}
