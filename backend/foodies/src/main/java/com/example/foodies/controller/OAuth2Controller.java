package com.example.foodies.controller;

import com.example.foodies.DTO.UserResponse;
import com.example.foodies.Util.JwtUtil;
import com.example.foodies.entity.UserEntity;
import com.example.foodies.repository.UserRepository;
import com.example.foodies.service.OAuth2Service;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/oauth2")
public class OAuth2Controller {

    private final OAuth2Service oAuth2Service;

    public OAuth2Controller(OAuth2Service oAuth2Service){
        this.oAuth2Service = oAuth2Service; 
    }

    // Redirect user to Google login
    @GetMapping("/authorize/google")
    public void redirectToGoogle(HttpServletResponse response) throws IOException {
       
        oAuth2Service.redirectToGoogle(response);
    }

    // Handle callback from Google
    @GetMapping("/callback/google")
    public void googleCallback(@RequestParam("code") String coded, HttpServletResponse response) throws IOException {
        
        oAuth2Service.googleCallback(coded, response);
    }
    
    
    @GetMapping("/getRefreshToken")
    public ResponseEntity<?> getRefreshToken(@RequestHeader("Authorization") String authorizationHeader){
        
        Map<String, Object> response = new HashMap<>();
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String accessToken = authorizationHeader.substring(7); 
            return oAuth2Service.getRefreshToken(accessToken);   
        }
        response.put("error", "No refresh token found");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        
    }
}


