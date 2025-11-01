package com.example.foodies.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.foodies.DTO.OrderRequest;
import com.example.foodies.service.PaymentService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentservice;

    public PaymentController(PaymentService paymentService) {
        this.paymentservice = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {  
        return paymentservice.createOrder(request);
    }

    @PostMapping("/verify-payment/{id}")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data, @PathVariable String id){
        if(id == null || id.length() == 0){
            ResponseEntity.badRequest().body("id is required");
        }
        return paymentservice.verifyPayment(data, id);
    }
    
    @GetMapping("/payment-info/{paymentId}")
    public ResponseEntity<?> paymentInfo(@PathVariable String paymentId){
        if(paymentId == null || paymentId.length() == 0){
            ResponseEntity.badRequest().body("paymentId is required");
        }
        System.out.println("paymentId :" + paymentId);
        return paymentservice.paymentInfo(paymentId);
    }
}
