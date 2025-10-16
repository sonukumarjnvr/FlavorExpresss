package com.example.foodies.controller;

import com.example.foodies.service.OAuth2Service;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.util.HashMap;
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


