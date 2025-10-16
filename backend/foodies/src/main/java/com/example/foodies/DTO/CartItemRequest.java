package com.example.foodies.DTO;

import java.util.List;

import org.checkerframework.checker.units.qual.N;

import com.example.foodies.entity.Customization;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequest {
    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Food ID is required")
    private String foodId;

    @NotBlank(message = "Food name is required")
    private String name;

    @NotBlank(message = "Size is required")
    private String size;

    @NotNull(message = "Count is required")
    private int count;

    @NotNull(message = "price can not be null")
    private double price;

    @NotNull(message = "price can not be null")
    @Min(value=0 , message = "discount can not be negative")
    @Max(value=100 , message = "discount can not be greater than 100")
    private String discount;

    @NotNull(message = "ImageUrl can not be null") 
    private String imageUrl;

    @NotNull(message = "Category can not be null") 
    private String category;

    @NotNull(message = "Description can not be null") 
    private String  description;

    private List<Customization> customization;
}
