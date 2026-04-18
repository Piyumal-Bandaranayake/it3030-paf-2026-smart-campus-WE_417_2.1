package com.sliit.smart_campus.config;

import com.sliit.smart_campus.model.Resource;
import com.sliit.smart_campus.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadTestData(ResourceRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                System.out.println("No data found in resources collection. Seeding test data...");

                Resource r1 = new Resource(null, "Main Lecture Hall", "HALL", "Largest lecture hall in the campus");
                Resource r2 = new Resource(null, "Central Library Lab", "LAB", "24/7 computer lab with 50 PCs");
                Resource r3 = new Resource(null, "Auditorium A", "HALL", "Main auditorium for campus events");
                Resource r4 = new Resource(null, "Sports Complex", "FACILITY", "Gym and sports equipment rental center");

                repository.saveAll(Arrays.asList(r1, r2, r3, r4));

                System.out.println("************************************************");
                System.out.println("Test Data Seeded Successfully!");
                System.out.println("************************************************");
            } else {
                System.out.println("Resources collection already has data. Skipping seeding.");
            }
        };
    }
}
