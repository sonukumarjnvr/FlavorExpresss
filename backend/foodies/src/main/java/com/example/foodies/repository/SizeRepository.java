package com.example.foodies.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
   
import com.example.foodies.entity.SizeEntity;

@Repository
public interface SizeRepository extends MongoRepository<SizeEntity, String> {
    List<SizeEntity> findAllByFoodId(String foodId);
}
