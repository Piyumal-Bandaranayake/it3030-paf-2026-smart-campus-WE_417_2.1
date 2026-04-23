package com.sliit.smart_campus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS for cross-origin requests from frontend (React)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Disable CSRF for simplified local development (Not recommended for production without careful consideration)
            .csrf(csrf -> csrf.disable())
            // Configure API endpoint permissions
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/login/**", "/oauth2/**", "/logout", "/uploads/**").permitAll() // Allow everyone to access authentication endpoints and uploads
                .requestMatchers(HttpMethod.GET, "/api/resource", "/api/resource/**", "/api/resources", "/api/resources/**").permitAll()
                .requestMatchers("/api/tickets/**").permitAll() // Permit access to ticket management
                .requestMatchers("/api/bookings/**").permitAll() // Permit access to booking management
                .requestMatchers("/api/users", "/api/users/**").permitAll() // Permit access to user management
                .requestMatchers("/api/notifications/**").permitAll() // Permit access to notifications
                .anyRequest().authenticated() // All other requests must be authenticated
            )
            // Configure Google OAuth login
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler) // Handle saving user details to MongoDB
            )
            // Configure logout to redirect back to frontend
            .logout(logout -> logout
                .logoutSuccessUrl("http://localhost:5173/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Allow only React frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // Allow sending session cookies or authentication headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
