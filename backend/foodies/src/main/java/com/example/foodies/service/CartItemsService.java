package com.example.foodies.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.example.foodies.DTO.CartItemModifyRequest;
import com.example.foodies.DTO.CartItemRequest;
import com.example.foodies.DTO.CartItemResponse;

public interface CartItemsService {
    public  ResponseEntity<?> addCartItem(CartItemRequest request, String id);
    public ResponseEntity<?> getCartItems(String id);
    public ResponseEntity<?> deleteCartItem(String id, CartItemModifyRequest request);
    public ResponseEntity<?> removeFromCart(String id, CartItemModifyRequest request);
}
