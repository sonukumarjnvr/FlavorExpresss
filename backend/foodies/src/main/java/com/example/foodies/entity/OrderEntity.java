package com.example.foodies.entity;

import java.util.List;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "orders")
@Builder
public class OrderEntity {
    @Id
    private String id;
    private String userId;
    private List<OrderItem> items;
    private double totalAmount;
    private String address;
    private String phone;
    private String status; // CREATED, PENDING, PAID, FAILED
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
