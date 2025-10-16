package com.example.foodies.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "cartItems")
public class CartItemsEntity {
    @Id
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
