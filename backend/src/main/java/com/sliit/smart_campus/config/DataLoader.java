package com.sliit.smart_campus.config;

import com.sliit.smart_campus.model.Resource;
import com.sliit.smart_campus.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadTestData(ResourceRepository repository) {
        return args -> {
            List<Resource> sampleResources = buildSampleResources();

            if (repository.count() == 0) {
                System.out.println("No data found in resources collection. Seeding test data...");

                repository.saveAll(sampleResources);

                System.out.println("Test Data Seeded Successfully!");
            } else {
                List<Resource> existingResources = repository.findAll();
                boolean updated = false;

                for (int index = 0; index < existingResources.size(); index++) {
                    Resource resource = existingResources.get(index);
                    Resource template = sampleResources.get(index % sampleResources.size());

                    if (isBlank(resource.getResourceCode())) {
                        resource.setResourceCode(template.getResourceCode());
                        updated = true;
                    }

                    if (isBlank(resource.getLocation())) {
                        resource.setLocation(template.getLocation());
                        updated = true;
                    }

                    if (resource.getCapacity() == null || resource.getCapacity() <= 0) {
                        resource.setCapacity(template.getCapacity());
                        updated = true;
                    }

                    if (isBlank(resource.getStatus())) {
                        resource.setStatus(template.getStatus());
                        updated = true;
                    }

                    if (isBlank(resource.getType())) {
                        resource.setType(template.getType());
                        updated = true;
                    } else {
                        String normalizedType = normalizeType(resource.getType());
                        if (!normalizedType.equals(resource.getType())) {
                            resource.setType(normalizedType);
                            updated = true;
                        }
                    }
                }

                if (updated) {
                    repository.saveAll(existingResources);
                    System.out.println("Existing resources were updated with list-view defaults.");
                } else {
                    System.out.println("Resources collection already has compatible data. Skipping seeding.");
                }

                List<Resource> missingSampleResources = sampleResources.stream()
                        .filter(sample -> !repository.existsByResourceCode(sample.getResourceCode()))
                        .collect(Collectors.toList());

                if (!missingSampleResources.isEmpty()) {
                    repository.saveAll(missingSampleResources);
                    System.out.println("Added missing sample resources: " + missingSampleResources.size());
                }
            }
        };
    }

    private List<Resource> buildSampleResources() {
        List<Resource> resources = new ArrayList<>();
        resources.add(new Resource(null, "RES-001", "Lecture Hall A", "Lecture Hall", "1st Floor", 120, "ACTIVE", "Large lecture hall for classes and seminars."));
        resources.add(new Resource(null, "RES-002", "Computer Lab 1", "Lab", "3rd Floor", 40, "ACTIVE", "Computer lab equipped for practical sessions."));
        resources.add(new Resource(null, "RES-003", "Meeting Room B", "Meeting Room", "2nd Floor", 12, "OUT_OF_SERVICE", "Meeting room currently unavailable for booking."));
        resources.add(new Resource(null, "RES-004", "Sports Complex", "Sports", "Ground Floor", 200, "ACTIVE", "Indoor sports and fitness facility."));
        resources.add(new Resource(null, "RES-005", "Research Lab 2", "Lab", "4th Floor", 25, "MAINTENANCE", "Research lab under scheduled maintenance."));
        resources.add(new Resource(null, "RES-006", "Conference Room A", "Meeting Room", "2nd Floor", 20, "ACTIVE", "Conference room for presentations and team meetings."));
        resources.add(new Resource(null, "EQP-001", "Projector X", "Equipment", "Media Lab", 1, "ACTIVE", "High-definition laser projector with wireless connectivity."));
        resources.add(new Resource(null, "EQP-002", "Camera Kit", "Equipment", "Equipment Room", 1, "ACTIVE", "Sony Alpha kit with 24-70mm lens and tripod."));
        resources.add(new Resource(null, "EQP-003", "VR Headset", "Equipment", "CS Lab", 1, "MAINTENANCE", "Oculus Quest 2 for immersive simulations."));
        resources.add(new Resource(null, "EQP-004", "3D Printer", "Equipment", "Innovation Hub", 1, "ACTIVE", "Industrial grade 3D printer for rapid prototyping."));
        resources.add(new Resource(null, "EQP-005", "Microphone Array", "Equipment", "Auditorium", 1, "OUT_OF_SERVICE", "Professional wireless mic system for large halls."));
        return resources;
    }

    private String normalizeType(String type) {
        if ("HALL".equalsIgnoreCase(type)) {
            return "Lecture Hall";
        }
        if ("LAB".equalsIgnoreCase(type)) {
            return "Lab";
        }
        if ("FACILITY".equalsIgnoreCase(type)) {
            return "Sports";
        }
        return type;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
