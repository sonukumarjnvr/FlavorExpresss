package com.example.foodies.DTO;

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
}