package com.example.foodies.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "User")
public class UserEntity {
    @Id
    private String id;
    private String name;
    private String phoneNumber;
    private String email;
    private String deliveryPin;
    private String profileImageUrl;
    private List<String> address;
    private List<String> orderHistory;
    private List<String> commentOn;
    private String role;
}
