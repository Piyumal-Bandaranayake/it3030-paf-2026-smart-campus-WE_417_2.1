package com.sliit.smart_campus.repository;

import com.sliit.smart_campus.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    // Admin-wide: targetEmail is null
    List<Notification> findByOrderByCreatedAtDesc();
    List<Notification> findByReadOrderByCreatedAtDesc(boolean read);
    List<Notification> findByTargetEmailIsNullOrderByCreatedAtDesc();

    // User-specific
    List<Notification> findByTargetEmailOrderByCreatedAtDesc(String targetEmail);
    List<Notification> findByTargetEmailAndReadOrderByCreatedAtDesc(String targetEmail, boolean read);
    void deleteByTargetEmail(String targetEmail);
}
