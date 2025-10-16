package com.example.foodies.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.example.foodies.DTO.UserResponse;
import com.example.foodies.Util.JwtUtil;
import com.example.foodies.entity.UserEntity;
import com.example.foodies.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class OAuth2ServiceImp implements OAuth2Service {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    @Value("${jwt.refreshTokenValidity}")
    private long refreshTokenValidity;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;


    //  Redirect user to Google login
    @Override
    public void redirectToGoogle(HttpServletResponse response) {  
        try {
            
            String url = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&scope=openid%20email%20profile";

            response.sendRedirect(url);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    @Override
    public void googleCallback(String code, HttpServletResponse response) throws IOException {  
       try {
        
            RestTemplate restTemplate = new RestTemplate();
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);
            params.add("grant_type", "authorization_code");

            Map<String, Object> tokenResponse = restTemplate.postForObject(
                    "https://oauth2.googleapis.com/token",
                    params,
                    Map.class
            );

            String idToken = (String) tokenResponse.get("id_token");

            GoogleIdToken.Payload payload = verifyGoogleIdToken(idToken);

            String email = payload.getEmail();
            String name = (String) payload.get("name");
            

            UserEntity entity = userRepository.findByEmail(email);
            if (entity == null) {
                entity = new UserEntity();
                entity.setEmail(email);
                entity.setName(name);
                String deliveryPin = String.valueOf(1000 + new Random().nextInt(9000));
                entity.setDeliveryPin(deliveryPin);
                userRepository.save(entity);
            }

            String accessToken = jwtUtil.generateAccessToken(entity.getId(), List.of("ROLE_USER"));
            
            response.sendRedirect("http://localhost:5173/oauth2success/?accessToken=" + accessToken);   

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("http://localhost:5173/login/failure");
        }
    }

    private GoogleIdToken.Payload verifyGoogleIdToken(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            return idToken.getPayload();
        } else {
            throw new IllegalArgumentException("Invalid ID token");
        }
    }

    private UserResponse covertEntityToResponse(UserEntity entity){
    return UserResponse.builder()
            .id(entity.getId())
            .name(entity.getName())
            .phoneNumber(entity.getPhoneNumber())
            .email(entity.getEmail())
            .deliveryPin(entity.getDeliveryPin())
            .profileImageUrl(entity.getProfileImageUrl())
            .address(entity.getAddress())
            .orderHistory(entity.getOrderHistory())
            .commentOn(entity.getCommentOn())
            .build();
    }


    @Override
    public ResponseEntity<?> getRefreshToken(String accessToken) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean verify = jwtUtil.validateToken(accessToken);
            if(verify){
                String userId = jwtUtil.extractUserId(accessToken);
                String refreshToken = jwtUtil.generateRefreshToken(userId);
                
                //store refresh token in cookies
                ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                            .httpOnly(true)
                            .secure(false)
                            .sameSite("strict")
                            .path("/")
                            .maxAge(refreshTokenValidity)
                            .build();

                UserEntity entity = userRepository.findById(userId)
                                        .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "userId not found"));
                UserResponse res = covertEntityToResponse(entity);
                res.setJwtAccessToken(accessToken);

                return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(res);
            }
            response.put("error", "Access token is not valid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            response.put("error", "Internal Server Error");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

}
