package com.sliit.smart_campus.config;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

/**
 * Runs once at application startup.
 * Pings MongoDB and prints a clear connected / failed message in the terminal.
 */
@Component
public class MongoConnectionLogger implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(MongoConnectionLogger.class);

    // ANSI color codes for terminal output
    private static final String GREEN  = "\u001B[32m";
    private static final String RED    = "\u001B[31m";
    private static final String YELLOW = "\u001B[33m";
    private static final String BOLD   = "\u001B[1m";
    private static final String RESET  = "\u001B[0m";

    private final MongoTemplate mongoTemplate;

    public MongoConnectionLogger(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            // Send a ping command to MongoDB
            Document result = mongoTemplate.executeCommand("{ ping: 1 }");

            String dbName = mongoTemplate.getDb().getName();

            System.out.println();
            System.out.println(BOLD + GREEN + "╔══════════════════════════════════════════════╗" + RESET);
            System.out.println(BOLD + GREEN + "║       ✅  MongoDB Connected Successfully      ║" + RESET);
            System.out.println(BOLD + GREEN + "╠══════════════════════════════════════════════╣" + RESET);
            System.out.println(BOLD + GREEN + "║  Database : " + RESET + YELLOW + dbName + padRight(dbName, 33) + GREEN + BOLD + "║" + RESET);
            System.out.println(BOLD + GREEN + "║  Status   : " + RESET + "Ready to accept connections   " + BOLD + GREEN + "║" + RESET);
            System.out.println(BOLD + GREEN + "╚══════════════════════════════════════════════╝" + RESET);
            System.out.println();

            log.info("MongoDB ping response: {}", result.toJson());

        } catch (Exception e) {
            System.out.println();
            System.out.println(BOLD + RED + "╔══════════════════════════════════════════════╗" + RESET);
            System.out.println(BOLD + RED + "║       ❌  MongoDB Connection FAILED           ║" + RESET);
            System.out.println(BOLD + RED + "╠══════════════════════════════════════════════╣" + RESET);
            System.out.println(BOLD + RED + "║  Error: " + RESET + e.getMessage()            + BOLD + RED + " ║" + RESET);
            System.out.println(BOLD + RED + "║  Check your MONGO_URI in the .env file       ║" + RESET);
            System.out.println(BOLD + RED + "╚══════════════════════════════════════════════╝" + RESET);
            System.out.println();

            log.error("MongoDB connection failed: {}", e.getMessage());
        }
    }

    /** Utility: pad string so columns align in the banner */
    private String padRight(String s, int totalSpaces) {
        int spaces = totalSpaces - s.length();
        return spaces > 0 ? " ".repeat(spaces) : "";
    }
}
