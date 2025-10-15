package com.example.foodies.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;



@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "Category")
public class CategoryEntity {
    @Id
    private String id;

    @NotBlank(message = "Diet name can not be empty")
    @Size(min=3, max=30, message="diet name must be between 3 to 30 character")
    private String categoryName;

    @NotBlank(message = " file can not be empty")
    private String categoryImageUrl;
}
