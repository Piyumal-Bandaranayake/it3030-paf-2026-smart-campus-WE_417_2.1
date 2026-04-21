package com.sliit.smart_campus.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConnectionConfig {

    private static final String MONGO_URI = "mongodb+srv://admin:12345@smartcampus.ozevafw.mongodb.net/smartcampus?retryWrites=true&w=majority";

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(MONGO_URI);
    }

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
