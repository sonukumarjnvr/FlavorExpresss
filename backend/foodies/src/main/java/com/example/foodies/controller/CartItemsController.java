package com.example.foodies.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.foodies.DTO.CartItemModifyRequest;
import com.example.foodies.DTO.CartItemRequest;
import com.example.foodies.service.CartItemsService;

import jakarta.validation.Valid;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/cartitems")
public class CartItemsController {
    @Autowired
    private CartItemsService cartItemsService;

    @PostMapping("/add/{id}")
    public ResponseEntity<?> addCartItem(@Valid @RequestBody CartItemRequest request, @PathVariable String id) {      
        if(id == null || id.isEmpty()){
            return ResponseEntity.badRequest().body("User ID is required");
        }

        System.out.println("cart item in controller of the cart items : " + request);
        return cartItemsService.addCartItem(request, id);
    }
    
    @GetMapping("/getcartitems/{id}")
    public ResponseEntity<?> getMethodName(@PathVariable String id) {
        if(id == null || id.isEmpty()){
            return ResponseEntity.badRequest().body("User ID is required");
        }

        return cartItemsService.getCartItems(id);
    }

    @DeleteMapping("/deletecartitem/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable String id, @Valid @RequestBody CartItemModifyRequest request) {
        if(id == null || id.isEmpty()){
            return ResponseEntity.badRequest().body("Cart Item ID is required");
        }

        return cartItemsService.deleteCartItem(id, request);
    }

    @PutMapping("removeFromCart/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable String id, @Valid @RequestBody CartItemModifyRequest request) {
        if(id == null || id.isEmpty()){
            return ResponseEntity.badRequest().body("Cart Item ID is required");
        }
        
        return  cartItemsService.removeFromCart(id, request);
    }


    
}
