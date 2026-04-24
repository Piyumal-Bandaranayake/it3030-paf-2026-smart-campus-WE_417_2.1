package com.sliit.smart_campus.config;

import com.sliit.smart_campus.model.User;
import com.sliit.smart_campus.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Load the OAuth2 user from Google
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        // Get email from Google profile
        String email = oAuth2User.getAttribute("email");
        
        // Load user from MongoDB to get their role
        Set<GrantedAuthority> authorities = new HashSet<>(oAuth2User.getAuthorities());
        
        if (email != null) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // Add role as authority with ROLE_ prefix for Spring Security
                String role = user.getRole() != null ? user.getRole() : "USER";
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
            } else {
                // New user - assign default USER role
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            }
        }
        
        // Return OAuth2User with updated authorities
        return new DefaultOAuth2User(authorities, oAuth2User.getAttributes(), "email");
    }
}
