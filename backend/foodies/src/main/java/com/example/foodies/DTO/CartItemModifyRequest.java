package com.example.foodies.DTO;

import java.util.List;
import com.example.foodies.entity.Customization;
import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class CartItemModifyRequest {
    @NotBlank(message = "Food ID is required")
    private String foodId;

    @NotBlank(message = "Size is required")
    private String size;
    
    private List<Customization> customization;
}
