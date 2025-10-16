package com.example.foodies.DTO;

import java.util.List;
import lombok.*;
import com.example.foodies.entity.OrderItem;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    @NotBlank(message = "Food ID is required")
    private String userId;

    @NotBlank(message = "items is required")
    private List<OrderItem> items;

    @NotNull
    @Min(value = 1, message = "price is always greater than 0")
    private double totalAmount;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Phone number is required")
    private String phone;
}


