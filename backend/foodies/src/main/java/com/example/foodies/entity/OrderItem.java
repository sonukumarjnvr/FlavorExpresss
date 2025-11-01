package com.example.foodies.entity;

import java.util.List;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    private String name;
    private int count;
    private int discount;
    private double price;
    private String size;    
    private String imageUrl;
    private List<Customization> customization;
}
