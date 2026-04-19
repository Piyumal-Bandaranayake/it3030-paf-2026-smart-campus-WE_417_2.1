package com.sliit.smart_campus.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "resources")
public class Resource {

    @Id
    private String id;
    private String resourceCode;
    private String name;
    private String type;
    private String location;
    private Integer capacity;
    private String status;
    private String description;

    // No-args constructor
    public Resource() {}

    // All-args constructor
    public Resource(
            String id,
            String resourceCode,
            String name,
            String type,
            String location,
            Integer capacity,
            String status,
            String description
    ) {
        this.id = id;
        this.resourceCode = resourceCode;
        this.name = name;
        this.type = type;
        this.location = location;
        this.capacity = capacity;
        this.status = status;
        this.description = description;
    }

    // Getters
    public String getId() { return id; }
    public String getResourceCode() { return resourceCode; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getLocation() { return location; }
    public Integer getCapacity() { return capacity; }
    public String getStatus() { return status; }
    public String getDescription() { return description; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setResourceCode(String resourceCode) { this.resourceCode = resourceCode; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setLocation(String location) { this.location = location; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setStatus(String status) { this.status = status; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return "Resource{id='" + id + "', resourceCode='" + resourceCode + "', name='" + name + "', type='" + type + "', status='" + status + "'}";
    }
}
