package com.example.foodies.DTO;

import java.util.List;

import com.example.foodies.entity.Customization;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemResponse {
    private String id;
    private String userId;
    private String foodId;
    private String name;
    private String size;
    private int count;
    private double price;
    private String discount;
    private String imageUrl;
    private String category;
    private String description;
    List<Customization> customization;
}
