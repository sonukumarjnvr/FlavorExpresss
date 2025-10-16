package com.example.foodies.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.foodies.entity.CartItemsEntity;

@Repository
public interface CartItemsRepository extends MongoRepository<CartItemsEntity, String> {
    List<CartItemsEntity> findByUserId(String userId);
    void deleteByUserId(String userId);
}
