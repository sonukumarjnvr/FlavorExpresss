package com.example.foodies.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "customization")
public class CustomizationEntity {
    @Id
    private String id;

    @NotNull(message = "categoryId can not be null")
    private String categoryId;

    @NotBlank(message = "customizationName can not be empty")
    @Size(min=2, max=30, message = "customizationName must have 2 to 30 characters")
    private String customizationName;

    @NotBlank(message = "customization type should be some name")
    private String type;

    @NotNull(message = "price can not be null")
    private double price;
}
