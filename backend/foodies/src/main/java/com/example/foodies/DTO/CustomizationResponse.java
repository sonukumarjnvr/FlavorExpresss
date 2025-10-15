package com.example.foodies.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomizationResponse {
    private String id;
    private String categoryId;
    private String customizationName;
    private String type;
    private double price;
}
