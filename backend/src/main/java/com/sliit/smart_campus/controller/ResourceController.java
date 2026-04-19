package com.sliit.smart_campus.controller;

import com.sliit.smart_campus.model.Resource;
import com.sliit.smart_campus.repository.ResourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        return ResponseEntity.ok(resourceRepository.save(resource));
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
