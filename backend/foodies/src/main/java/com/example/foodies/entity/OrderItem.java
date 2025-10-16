package com.example.foodies.entity;

import java.util.List;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    private String productName;
    private int quantity;
    private double price;
    private List<Customization> customization;
}
