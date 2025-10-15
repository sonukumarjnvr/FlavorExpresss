package com.example.foodies.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
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
@Document(collection = "foodSize")
public class SizeEntity {
    @Id
    private String id;

    @NotBlank(message = "foodId con not be null")
    private String foodId;

    @NotBlank(message = "size name can not null")
    @Size(min=1, max=30, message="size name should be between 1 to 30 character")
    private String sizeName;

    @NotNull
    @Min(value = 1, message = "price is always greater than 0")
    private Double price;  

    @Min(value=0 , message = "discount can not be negative")
    private Double discount;
}
