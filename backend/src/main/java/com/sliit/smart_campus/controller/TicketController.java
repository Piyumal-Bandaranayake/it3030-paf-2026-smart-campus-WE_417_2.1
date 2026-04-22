package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.model.Notification;
import com.sliit.smart_campus.model.Ticket;
import com.sliit.smart_campus.repository.NotificationRepository;
import com.sliit.smart_campus.repository.TicketRepository;
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
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "technician", required = false) String technician,
            @RequestParam(value = "manager", required = false) String manager) {
        
        if (email != null && !email.isEmpty()) {
            return new ResponseEntity<>(ticketRepository.findByUserEmail(email), HttpStatus.OK);
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
                    ticket.setStatus(status);
                    if ("Rejected".equals(status) && rejectionReason != null) {
                        ticket.setRejectionReason(rejectionReason);
                    }
                    if ("Resolved".equals(status) && resolutionNote != null) {
                        ticket.setResolutionNote(resolutionNote);
                    }
                    ticket.setUpdatedAt(LocalDateTime.now());
                    Ticket updatedTicket = ticketRepository.save(ticket);
                    return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTicket(@PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        String technician = payload.get("technician");
        String manager = payload.get("manager");

        return ticketRepository.findById(id)
                .map(ticket -> {
                    if (payload.containsKey("technician")) ticket.setAssignedTechnician(technician);
                    if (payload.containsKey("manager")) ticket.setAssignedManager(manager);
                    ticket.setUpdatedAt(LocalDateTime.now());
                    Ticket updatedTicket = ticketRepository.save(ticket);
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
}
