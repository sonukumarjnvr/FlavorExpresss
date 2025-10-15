package com.example.foodies.DTO;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryRequest {
    @NotBlank(message = "Diet name cannot be empty")
    @Size(min = 3, max = 30, message = "Diet name must be between 3 to 30 characters")
    private String categoryName;
    private String categoryImageUrl;  
    private String previousImageUrl; 
}


