package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.model.User;
import com.sliit.smart_campus.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Endpoint: /api/auth/me
     * Purpose: Returns the currently logged-in user's details from MongoDB.
     * Uses the principal (Google OAuth2 profile) to look up the user by email.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            // Return 401 Unauthorized if no user is signed in
            return ResponseEntity.status(401).body("Not authenticated");
        }

        // Use the email from Google profile to find our saved user in MongoDB
        String email = principal.getAttribute("email");
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }

        return ResponseEntity.status(404).body("User not found in system");
    }

    /**
     * Endpoint: /api/auth/check
     * Purpose: Returns authentication status and authorities for debugging
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(java.util.Map.of(
                "authenticated", false,
                "message", "Not authenticated"
            ));
        }

        String email = principal.getAttribute("email");
        Optional<User> user = userRepository.findByEmail(email);

        return ResponseEntity.ok(java.util.Map.of(
            "authenticated", true,
            "email", email,
            "authorities", principal.getAuthorities().stream()
                .map(Object::toString)
                .toList(),
            "role", user.map(User::getRole).orElse("UNKNOWN")
        ));
    }
}
