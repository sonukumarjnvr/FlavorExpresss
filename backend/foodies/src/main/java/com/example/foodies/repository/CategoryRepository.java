package com.example.foodies.repository;

import org.springframework.stereotype.Repository;
import com.example.foodies.entity.CategoryEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface CategoryRepository extends MongoRepository<CategoryEntity, String> {

} 