package com.sliit.smart_campus.repository;

import com.sliit.smart_campus.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Custom query method to find a user by their email address
    Optional<User> findByEmail(String email);

    // Find user by their name
    Optional<User> findByName(String name);

    // Find user by their name (case-insensitive)
    Optional<User> findByNameIgnoreCase(String name);

    // Find users by their role
    List<User> findByRole(String role);
}
