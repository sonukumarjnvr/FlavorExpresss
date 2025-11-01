package com.example.foodies.DTO;

import java.time.LocalDateTime;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {
    private String id;
    private double totalAmount;
    private String razorpayOrderId;
    private String keyId;
    private String currency;
    private String OrderNo;
    private String imageUrl;
    private LocalDateTime orderDateTime;
}