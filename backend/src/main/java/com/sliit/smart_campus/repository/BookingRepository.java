package com.sliit.smart_campus.repository;

import com.sliit.smart_campus.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<Booking> findByOrderByCreatedAtDesc();
    List<Booking> findByResourceIdAndDate(String resourceId, String date);
    long countByStatusIgnoreCase(String status);
}
