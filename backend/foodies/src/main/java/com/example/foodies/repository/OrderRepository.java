package com.example.foodies.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.foodies.entity.OrderEntity;


public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    OrderEntity findByRazorpayOrderId(String razorpayOrderId);
}
