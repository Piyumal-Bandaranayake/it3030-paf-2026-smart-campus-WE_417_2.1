package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.model.Resource;
import com.sliit.smart_campus.repository.ResourceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping({"/api/resource", "/api/resources"})
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ResourceController {

    private final ResourceRepository resourceRepository;

    public ResourceController(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        // Validate required fields
        if (isBlank(resource.getName()) || isBlank(resource.getType()) || isBlank(resource.getLocation())) {
            return ResponseEntity.badRequest().build();
        }

        // Normalize the resource
        normalizeResource(resource);

        // Generate resourceCode if not provided
        if (isBlank(resource.getResourceCode())) {
            resource.setResourceCode(generateNextResourceCode(resource.getType()));
        }

        // Set default status if not provided
        if (isBlank(resource.getStatus())) {
            resource.setStatus("ACTIVE");
        }

        Resource savedResource = resourceRepository.save(resource);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedResource);
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceRepository.findAllByOrderByResourceCodeAsc());
    }

    @GetMapping("/equipment")
    public ResponseEntity<List<Resource>> getEquipmentResources() {
        return ResponseEntity.ok(resourceRepository.findByTypeIgnoreCaseOrderByResourceCodeAsc("Equipment"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        return resourceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable String id, @RequestBody Resource resource) {
        return resourceRepository.findById(id)
                .map(existing -> {
                    // Validate required fields
                    if (isBlank(resource.getName()) || isBlank(resource.getType()) || isBlank(resource.getLocation())) {
                        return ResponseEntity.badRequest().<Resource>build();
                    }

                    normalizeResource(resource);

                    existing.setName(resource.getName());
                    existing.setType(resource.getType());
                    existing.setLocation(resource.getLocation());
                    existing.setCapacity(resource.getCapacity());
                    existing.setStatus(resource.getStatus());
                    existing.setDescription(resource.getDescription());

                    return ResponseEntity.ok(resourceRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void normalizeResource(Resource resource) {
        if (resource.getType() != null) {
            resource.setType(resource.getType().trim());
        }
        if (resource.getStatus() != null) {
            resource.setStatus(resource.getStatus().toUpperCase(Locale.ENGLISH).trim());
        }
    }

    private String generateNextResourceCode(String type) {
        List<Resource> resources = resourceRepository.findByType(type);
        int count = resources.size() + 1;
        String prefix = type.substring(0, Math.min(3, type.length())).toUpperCase(Locale.ENGLISH);
        return prefix + "-" + String.format("%03d", count);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
