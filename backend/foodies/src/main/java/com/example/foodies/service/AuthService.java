package com.example.foodies.service;


import org.springframework.http.ResponseEntity;

import com.example.foodies.DTO.UserRequest;
import com.example.foodies.DTO.UserResponse;

public interface AuthService {
    public ResponseEntity<UserResponse> verify(String idToken, UserRequest request);
    public ResponseEntity<UserResponse> refreshToNewAccessToken(String refreshToken);
    public ResponseEntity<?> updateName(String userId, String name);
}
