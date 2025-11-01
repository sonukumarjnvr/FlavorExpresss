package com.example.foodies.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.example.foodies.DTO.OrderRequest;

public interface PaymentService {
    ResponseEntity<?> createOrder(OrderRequest request);
    ResponseEntity<?> verifyPayment(Map<String, String> data, String userId);
    ResponseEntity<?> paymentInfo(String paymentId);
}
