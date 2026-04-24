package com.sliit.smart_campus.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConnectionConfig {

    @Bean
    public CommandLineRunner checkMongoConnection(MongoTemplate mongoTemplate) {
        return args -> {
            try {
                // Try to get the names of collections as a simple ping
                mongoTemplate.getCollectionNames();
                System.out.println("================================================");
                System.out.println("MongoDB Atlas connected successfully!");
                System.out.println("================================================");
            } catch (Exception e) {
                System.err.println("================================================");
                System.err.println("MongoDB Atlas connection failed!");
                System.err.println("Error: " + e.getMessage());
                System.err.println("================================================");
            }
        };
    }
}
