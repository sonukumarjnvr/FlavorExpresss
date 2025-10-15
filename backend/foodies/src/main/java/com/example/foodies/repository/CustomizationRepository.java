package com.example.foodies.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.foodies.entity.CustomizationEntity;

@Repository
public interface CustomizationRepository extends MongoRepository<CustomizationEntity, String> {
    List<CustomizationEntity> findAllByCategoryId(String categoryId);
}
