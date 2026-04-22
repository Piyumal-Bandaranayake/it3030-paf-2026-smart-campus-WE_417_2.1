package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.model.Comment;
import com.sliit.smart_campus.model.Notification;
import com.sliit.smart_campus.model.Ticket;
import com.sliit.smart_campus.repository.CommentRepository;
import com.sliit.smart_campus.repository.NotificationRepository;
import com.sliit.smart_campus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<Comment>> getCommentsByTicket(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId));
    }

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment) {
        if (comment.getTicketId() == null || comment.getText() == null || comment.getText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Description and Ticket ID are required.");
        }

        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);

        // Notify the ticket owner if someone else comments
        Optional<Ticket> ticketOpt = ticketRepository.findById(comment.getTicketId());
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            if (ticket.getUserEmail() != null && !ticket.getUserEmail().equalsIgnoreCase(comment.getUserEmail())) {
                Notification notification = new Notification(
                    "TICKET_UPDATE",
                    "New comment on your ticket",
                    comment.getUserName() + " commented: " + comment.getText(),
                    ticket.getId(),
                    ticket.getUserEmail()
                );
                notificationRepository.save(notification);
            }
        }

        return ResponseEntity.ok(savedComment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id, @RequestParam String userEmail) {
        Optional<Comment> commentOpt = commentRepository.findById(id);
        if (commentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Comment comment = commentOpt.get();
        if (!comment.getUserEmail().equalsIgnoreCase(userEmail)) {
            return ResponseEntity.status(403).body("You can only delete your own comments.");
        }

        commentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
