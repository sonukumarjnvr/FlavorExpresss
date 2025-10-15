package com.example.foodies.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.foodies.entity.FoodEntity;
import java.util.List;



@Repository
public interface FoodRepository extends MongoRepository<FoodEntity, String> {
    List<FoodEntity> findAllByCategory(String category);
}
