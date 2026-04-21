package com.sliit.smart_campus.repository;

import com.sliit.smart_campus.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByType(String type);
    List<Resource> findAllByOrderByResourceCodeAsc();
    List<Resource> findByTypeIgnoreCaseOrderByResourceCodeAsc(String type);
    boolean existsByResourceCode(String resourceCode);
}
