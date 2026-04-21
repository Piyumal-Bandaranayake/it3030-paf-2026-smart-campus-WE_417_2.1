package com.sliit.smart_campus.repository;

import com.sliit.smart_campus.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserEmail(String userEmail);
    List<Ticket> findByStatus(String status);
}
