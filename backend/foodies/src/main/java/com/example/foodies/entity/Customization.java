package com.example.foodies.entity;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customization {
    private String id;
    private String customizationName;
    private double price;
}
