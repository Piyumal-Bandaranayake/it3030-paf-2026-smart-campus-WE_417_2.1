package com.sliit.smart_campus.config;

import com.sliit.smart_campus.model.User;
import com.sliit.smart_campus.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    public OAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) 
            throws IOException, ServletException {
        // Get the logged-in user details from Google
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");
        String picture = oAuth2User.getAttribute("picture");

        // Check if user already exists in MongoDB
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            // New user - Save to MongoDB with default USER role
            User newUser = User.builder()
                    .name(name)
                    .email(email)
                    .profilePicture(picture)
                    .provider("GOOGLE")
                    .role("USER") // Assign default role (stored without ROLE_ prefix)
                    .status("Active") // Assign default status
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(newUser);
        } else {
            // Existing user - Update their basic details if changed
            User user = existingUser.get();
            boolean changed = false;
            if (!name.equals(user.getName())) {
                user.setName(name);
                changed = true;
            }
            if (picture != null && !picture.equals(user.getProfilePicture())) {
                user.setProfilePicture(picture);
                changed = true;
            }
            if (changed) {
                userRepository.save(user);
            }
        }

        // Redirect directly to the user dashboard after login
        response.sendRedirect(frontendUrl + "/user-dashboard?login_success=true");
    }
}
