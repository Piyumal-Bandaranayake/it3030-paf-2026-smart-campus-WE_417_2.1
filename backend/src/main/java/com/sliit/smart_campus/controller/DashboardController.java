package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.repository.BookingRepository;
import com.sliit.smart_campus.repository.ResourceRepository;
import com.sliit.smart_campus.repository.TicketRepository;
import com.sliit.smart_campus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total users
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);

        // Pending bookings
        long pendingBookings = bookingRepository.findAll().stream()
                .filter(b -> "PENDING".equalsIgnoreCase(b.getStatus()))
                .count();
        stats.put("pendingBookings", pendingBookings);

        // Active resources
        long activeResources = resourceRepository.findAll().stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()))
                .count();
        stats.put("activeResources", activeResources);

        // Maintenance tasks (Open tickets)
        long maintenanceTasks = ticketRepository.findAll().stream()
                .filter(t -> "Open".equalsIgnoreCase(t.getStatus()) || "In Progress".equalsIgnoreCase(t.getStatus()))
                .count();
        stats.put("maintenanceTasks", maintenanceTasks);

        return ResponseEntity.ok(stats);
    }
}
