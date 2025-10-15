package com.example.foodies.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomizationRequest {

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
