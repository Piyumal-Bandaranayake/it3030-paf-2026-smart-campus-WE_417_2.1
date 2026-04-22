package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.model.Booking;
import com.sliit.smart_campus.model.Notification;
import com.sliit.smart_campus.repository.BookingRepository;
import com.sliit.smart_campus.repository.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final NotificationRepository notificationRepository;

    public BookingController(BookingRepository bookingRepository, NotificationRepository notificationRepository) {
        this.bookingRepository = bookingRepository;
        this.notificationRepository = notificationRepository;
    }

    // Create a new booking (user)
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        if (booking.getUserEmail() == null || booking.getResourceId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User email and resource ID are required."));
        }

        // Conflict check: Check for overlapping bookings for the same resource on the same date
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDate(booking.getResourceId(), booking.getDate());
        for (Booking existing : existingBookings) {
            // Only check against PENDING or APPROVED bookings
            if (!"REJECTED".equalsIgnoreCase(existing.getStatus()) && !"CANCELLED".equalsIgnoreCase(existing.getStatus())) {
                // Overlap logic: (NewStart < ExistingEnd) && (NewEnd > ExistingStart)
                if (booking.getStartTime().compareTo(existing.getEndTime()) < 0 && 
                    booking.getEndTime().compareTo(existing.getStartTime()) > 0) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(Map.of("message", "This resource is already booked for the selected time slot. Please choose another time."));
                }
            }
        }

        // Generate bookingId
        long count = bookingRepository.count();
        booking.setBookingId("BK-" + String.format("%04d", count + 1));
        
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        // Create Notification for Admin
        String resName = (savedBooking.getResourceName() != null && !savedBooking.getResourceName().isEmpty())
                         ? savedBooking.getResourceName()
                         : booking.getResourceId();

        Notification notification = new Notification(
            "BOOKING",
            "New Resource Booking",
            "A new booking (" + savedBooking.getBookingId() + ") has been made for " + resName + " by " + booking.getUserEmail(),
            savedBooking.getId()
        );
        notificationRepository.save(notification);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
    }

    // Get bookings for a specific user (by email)
    @GetMapping
    public ResponseEntity<List<Booking>> getUserBookings(@RequestParam String email) {
        return ResponseEntity.ok(bookingRepository.findByUserEmailOrderByCreatedAtDesc(email));
    }

    // Get ALL bookings (admin)
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findByOrderByCreatedAtDesc());
    }

    // Approve or Reject a booking (admin)
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking = optionalBooking.get();
        String previousStatus = booking.getStatus();
        booking.setStatus(newStatus.toUpperCase());
        
        if ("REJECTED".equalsIgnoreCase(newStatus)) {
            booking.setRejectionReason(body.get("reason"));
        }
        
        Booking updated = bookingRepository.save(booking);

        // Notify the user about the booking status change
        if (!newStatus.equalsIgnoreCase(previousStatus)) {
            String resName = (updated.getResourceName() != null && !updated.getResourceName().isEmpty())
                    ? updated.getResourceName() : updated.getResourceId();
            String title;
            String message;
            if ("APPROVED".equalsIgnoreCase(newStatus)) {
                title = "Booking Approved ✅";
                message = "Your booking (" + updated.getBookingId() + ") for " + resName
                        + " on " + updated.getDate() + " has been approved.";
            } else if ("REJECTED".equalsIgnoreCase(newStatus)) {
                String reason = body.get("reason");
                title = "Booking Rejected ❌";
                message = "Your booking (" + updated.getBookingId() + ") for " + resName
                        + " was rejected" + (reason != null ? ": " + reason : ".");
            } else {
                title = "Booking Status Updated";
                message = "Your booking (" + updated.getBookingId() + ") status changed to " + newStatus + ".";
            }
            Notification userNotification = new Notification(
                "BOOKING_UPDATE", title, message, updated.getId(), updated.getUserEmail()
            );
            notificationRepository.save(userNotification);
        }

        return ResponseEntity.ok(updated);
    }

    // Cancel a booking (User)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable String id) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking = optionalBooking.get();
        String currentStatus = booking.getStatus();

        // If it's already REJECTED or CANCELLED, allow hard delete to clear history
        if ("REJECTED".equalsIgnoreCase(currentStatus) || "CANCELLED".equalsIgnoreCase(currentStatus)) {
            bookingRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        // Otherwise, soft cancel by updating status
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        return ResponseEntity.ok(booking);
    }
}
