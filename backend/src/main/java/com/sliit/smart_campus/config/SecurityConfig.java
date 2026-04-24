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
    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(OAuth2SuccessHandler oAuth2SuccessHandler, CustomOAuth2UserService customOAuth2UserService) {
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.customOAuth2UserService = customOAuth2UserService;
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
                // Public endpoints - no authentication required
                .requestMatchers("/api/auth/**", "/login/**", "/oauth2/**", "/logout", "/uploads/**").permitAll()
                
                // Resources - GET is public, modifications require ADMIN
                .requestMatchers(HttpMethod.GET, "/api/resource", "/api/resource/**", "/api/resources", "/api/resources/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/resource", "/api/resources").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/resource/**", "/api/resources/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/resource/**", "/api/resources/**").hasAuthority("ROLE_ADMIN")
                
                // Tickets - authenticated users can create/view their own, ADMIN/MANAGER/TECHNICIAN can manage all
                .requestMatchers(HttpMethod.POST, "/api/tickets").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/tickets", "/api/tickets/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/tickets/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TECHNICIAN")
                .requestMatchers(HttpMethod.DELETE, "/api/tickets/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                
                // Bookings - authenticated users can create/view their own, ADMIN can manage all
                .requestMatchers(HttpMethod.POST, "/api/bookings").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/bookings", "/api/bookings/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/bookings/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").authenticated() // Users can cancel their own
                
                // Comments - authenticated users can add/delete their own comments
                .requestMatchers("/api/comments/**").authenticated()
                
                // Notifications - authenticated users can view their own, ADMIN can view all
                .requestMatchers("/api/notifications/**").authenticated()
                
                // User management - ADMIN only
                .requestMatchers("/api/users", "/api/users/**").hasAuthority("ROLE_ADMIN")
                
                // Dashboard statistics - ADMIN only
                .requestMatchers("/api/dashboard/stats").hasAuthority("ROLE_ADMIN")
                
                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            // Configure Google OAuth login
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService) // Use custom service to load roles from MongoDB
                )
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
