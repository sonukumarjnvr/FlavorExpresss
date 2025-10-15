package com.example.foodies.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.foodies.DTO.UserRequest;
import com.example.foodies.DTO.UserResponse;
import com.example.foodies.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;




@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService userService;

    public AuthController(AuthService userService) {
        this.userService = userService;
    }

    @GetMapping("/refresh")
    public ResponseEntity<UserResponse> refresh(@CookieValue(name="refreshToken", required = false) String Token){
        if (Token == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh token can not be null");
        }

        System.out.println("refresh Token controller : " + Token);

        return userService.refreshToNewAccessToken(Token);
    }


    @PostMapping("/login")
    public ResponseEntity<UserResponse> verify(@Valid @RequestBody UserRequest request, @RequestHeader("Authorization") String authHeader){
        String idToken = authHeader.replace("Bearer ", "");
        if(idToken == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "idToken can not be null");
        }
        return userService.verify(idToken, request);
    }
    

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(0)
                        .build(); 
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok("Logged Out Successfully");
    }
}
