package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.model.Notification;
import com.sliit.smart_campus.model.Ticket;
import com.sliit.smart_campus.repository.NotificationRepository;
import com.sliit.smart_campus.repository.TicketRepository;
import com.sliit.smart_campus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private static final String UPLOAD_DIR = "uploads/tickets/";

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createTicket(
            @RequestParam("resource") String resource,
            @RequestParam("location") String location,
            @RequestParam("category") String category,
            @RequestParam("priority") String priority,
            @RequestParam("description") String description,
            @RequestParam("userEmail") String userEmail,
            @RequestParam(value = "contactName", required = false) String contactName,
            @RequestParam(value = "contactEmail", required = false) String contactEmail,
            @RequestParam(value = "contactPhone", required = false) String contactPhone,
            @RequestParam(value = "attachments", required = false) MultipartFile[] attachments) {

        try {
            Ticket ticket = new Ticket();
            ticket.setTicketId("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            ticket.setResource(resource);
            ticket.setLocation(location);
            ticket.setCategory(category);
            ticket.setPriority(priority.toLowerCase());
            ticket.setDescription(description);
            ticket.setUserEmail(userEmail);
            ticket.setContactName(contactName);
            ticket.setContactEmail(contactEmail);
            ticket.setContactPhone(contactPhone);
            ticket.setStatus("Open");
            ticket.setCreatedAt(LocalDateTime.now());
            ticket.setUpdatedAt(LocalDateTime.now());

            List<String> imageUrls = new ArrayList<>();
            if (attachments != null && attachments.length > 0) {
                File uploadPath = new File(UPLOAD_DIR);
                if (!uploadPath.exists()) {
                    uploadPath.mkdirs();
                }

                for (MultipartFile file : attachments) {
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path path = Paths.get(UPLOAD_DIR + fileName);
                    Files.write(path, file.getBytes());
                    imageUrls.add("/uploads/tickets/" + fileName);
                }
            }
            ticket.setImages(imageUrls);

            Ticket savedTicket = ticketRepository.save(ticket);

            // Create Notification for Admin
            Notification notification = new Notification(
                "TICKET",
                "New Ticket Raised",
                "A new ticket (" + savedTicket.getTicketId() + ") has been raised for " + resource + " by " + userEmail,
                savedTicket.getId()
            );
            notificationRepository.save(notification);

            return new ResponseEntity<>(savedTicket, HttpStatus.CREATED);

        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload images: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create ticket: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String technician,
            @RequestParam(required = false) String manager,
            @RequestParam(required = false) String technicianEmail,
            @RequestParam(required = false) String managerEmail) {
        
        if (email != null && !email.isEmpty()) {
            return new ResponseEntity<>(ticketRepository.findByUserEmail(email), HttpStatus.OK);
        }
        if (technicianEmail != null && !technicianEmail.isEmpty()) {
            return new ResponseEntity<>(ticketRepository.findByAssignedTechnicianEmail(technicianEmail), HttpStatus.OK);
        }
        if (managerEmail != null && !managerEmail.isEmpty()) {
            return new ResponseEntity<>(ticketRepository.findByAssignedManagerEmail(managerEmail), HttpStatus.OK);
        }
        if (technician != null && !technician.isEmpty()) {
            return new ResponseEntity<>(ticketRepository.findByAssignedTechnician(technician), HttpStatus.OK);
        }
        if (manager != null && !manager.isEmpty()) {
            return new ResponseEntity<>(ticketRepository.findByAssignedManager(manager), HttpStatus.OK);
        }
        return new ResponseEntity<>(ticketRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable String id) {
        return ticketRepository.findById(id)
                .map(ticket -> new ResponseEntity<>(ticket, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        String status = payload.get("status");
        String rejectionReason = payload.get("rejectionReason");
        String resolutionNote = payload.get("resolutionNote");
        
        if (status == null || status.isEmpty()) {
            return new ResponseEntity<>("Status is required", HttpStatus.BAD_REQUEST);
        }

        return ticketRepository.findById(id)
                .map(ticket -> {
                    String oldStatus = ticket.getStatus();
                    ticket.setStatus(status);
                    if ("Rejected".equals(status) && rejectionReason != null) {
                        ticket.setRejectionReason(rejectionReason);
                    }
                    if ("Resolved".equals(status) && resolutionNote != null) {
                        ticket.setResolutionNote(resolutionNote);
                    }
                    ticket.setUpdatedAt(LocalDateTime.now());
                    Ticket updatedTicket = ticketRepository.save(ticket);

                    // Notify the ticket owner if status actually changed
                    if (!status.equals(oldStatus) && updatedTicket.getUserEmail() != null) {
                        String notifTitle;
                        String notifMessage;
                        if ("Resolved".equals(status)) {
                            notifTitle = "Ticket Resolved ✅";
                            notifMessage = "Your ticket (" + updatedTicket.getTicketId() + ") has been resolved"
                                    + (resolutionNote != null ? ". Note: " + resolutionNote : ".");
                        } else if ("Rejected".equals(status)) {
                            notifTitle = "Ticket Rejected ❌";
                            notifMessage = "Your ticket (" + updatedTicket.getTicketId() + ") was rejected"
                                    + (rejectionReason != null ? ": " + rejectionReason : ".");
                        } else if ("Closed".equals(status)) {
                            notifTitle = "Ticket Closed 🔒";
                            notifMessage = "Your ticket (" + updatedTicket.getTicketId() + ") has been officially closed and archived.";
                        } else if ("In Progress".equals(status)) {
                            notifTitle = "Ticket In Progress 🔧";
                            notifMessage = "Your ticket (" + updatedTicket.getTicketId() + ") is now being worked on.";
                        } else {
                            notifTitle = "Ticket Updated";
                            notifMessage = "Your ticket (" + updatedTicket.getTicketId() + ") status changed to " + status + ".";
                        }
                        Notification userNotif = new Notification(
                            "TICKET_UPDATE", notifTitle, notifMessage,
                            updatedTicket.getId(), updatedTicket.getUserEmail()
                        );
                        notificationRepository.save(userNotif);
                    }

                    // Notify Assigned Staff (Technician/Manager) if status changed
                    if (!status.equals(oldStatus)) {
                        String staffNotifTitle = "Ticket Update: " + updatedTicket.getTicketId();
                        String staffNotifMsg = "Ticket for " + updatedTicket.getResource() + " status changed to " + status + ".";
                        
                        if (updatedTicket.getAssignedTechnician() != null) {
                            sendNotificationToUser(updatedTicket.getAssignedTechnician(), updatedTicket.getAssignedTechnicianEmail(), 
                                "TICKET_UPDATE", staffNotifTitle, staffNotifMsg, updatedTicket.getId());
                        }
                        if (updatedTicket.getAssignedManager() != null) {
                            sendNotificationToUser(updatedTicket.getAssignedManager(), updatedTicket.getAssignedManagerEmail(), 
                                "TICKET_UPDATE", staffNotifTitle, staffNotifMsg, updatedTicket.getId());
                        }
                    }

                    return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTicket(@PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        String technician = payload.get("technician");
        String technicianEmail = payload.get("technicianEmail");
        String manager = payload.get("manager");
        String managerEmail = payload.get("managerEmail");

        return ticketRepository.findById(id)
                .map(ticket -> {
                    if (payload.containsKey("technician")) {
                        ticket.setAssignedTechnician(technician);
                        ticket.setAssignedTechnicianEmail(technicianEmail);
                    }
                    if (payload.containsKey("manager")) {
                        ticket.setAssignedManager(manager);
                        ticket.setAssignedManagerEmail(managerEmail);
                    }
                    ticket.setUpdatedAt(LocalDateTime.now());
                    Ticket updatedTicket = ticketRepository.save(ticket);

                    // Notify the technician if assigned
                    if (payload.containsKey("technician") && technician != null) {
                        sendNotificationToUser(technician, technicianEmail, "TICKET_UPDATE", "New Ticket Assigned", 
                            "You have been assigned to ticket " + updatedTicket.getTicketId() + " (" + updatedTicket.getResource() + ").", updatedTicket.getId());
                    }
                    // Notify the manager if assigned
                    if (payload.containsKey("manager") && manager != null) {
                        sendNotificationToUser(manager, managerEmail, "TICKET_UPDATE", "New Task Supervised", 
                            "You are now supervising ticket " + updatedTicket.getTicketId() + " (" + updatedTicket.getResource() + ").", updatedTicket.getId());
                    }

                    return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticketRepository.delete(ticket);
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    private void sendNotificationToUser(String name, String email, String type, String title, String message, String targetId) {
        if (email != null && !email.trim().isEmpty()) {
            Notification notif = new Notification(type, title, message, targetId, email);
            notificationRepository.save(notif);
        } else if (name != null && !name.trim().isEmpty()) {
            // Fallback to searching by name if email is not provided
            userRepository.findByNameIgnoreCase(name.trim()).ifPresent(user -> {
                Notification notif = new Notification(type, title, message, targetId, user.getEmail());
                notificationRepository.save(notif);
            });
        }
    }
}
