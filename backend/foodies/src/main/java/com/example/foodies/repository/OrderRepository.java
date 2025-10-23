package com.example.foodies.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.foodies.entity.OrderEntity;

@Repository
public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    OrderEntity findByRazorpayOrderId(String razorpayOrderId);
    List<OrderEntity> findAllByUserId(String userId);
}
