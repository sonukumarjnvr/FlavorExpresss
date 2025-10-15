package com.example.foodies.DTO;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SizeResponse {
    @Id
    private String id;
    private String foodId;
    private String sizeName;
    private double price;
    private double discount;
}
