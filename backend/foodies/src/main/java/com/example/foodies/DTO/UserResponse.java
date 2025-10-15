package com.example.foodies.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String name;
    private String phoneNumber;
    private String email;
    private String deliveryPin;
    private String profileImageUrl;
    private List<String> address;
    private List<String> orderHistory;
    private List<String> commentOn;
    private String jwtAccessToken;
}
