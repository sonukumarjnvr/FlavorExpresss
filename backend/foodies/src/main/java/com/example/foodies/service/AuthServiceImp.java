package com.example.foodies.service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpHeaders;
import com.example.foodies.DTO.UserRequest;
import com.example.foodies.DTO.UserResponse;
import com.example.foodies.Util.JwtUtil;
import com.example.foodies.entity.UserEntity;
import com.example.foodies.repository.UserRepository;
import com.google.firebase.auth.FirebaseToken;


@Service
public class AuthServiceImp implements AuthService {

    private final UserRepository userRepository;
    private final FirebaseTokenService firebaseTokenService;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refreshTokenValidity}")
    private long refreshTokenValidity;

    
    public AuthServiceImp( UserRepository userRepository,  FirebaseTokenService firebaseTokenService, JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.firebaseTokenService = firebaseTokenService;
        this.jwtUtil = jwtUtil;
    }


    @Override
    public ResponseEntity<UserResponse> verify(String idToken, UserRequest request) {
        try {
           // String OTP = String.valueOf(100000 + new Random().nextInt(900000));
            //send otp
            //boolean sent = twilioService.sentOtp(request.getPhoneNumber(), OTP);
            
            // if(sent){
            //     redisTemplate.opsForValue().set("OTP:" + request.getPhoneNumber(), OTP, 2, TimeUnit.MINUTES);
            //     return true;
            // }

            System.out.println(idToken);
            

            //System.out.println(redisTemplate.opsForValue().get(OTP));

            //verify user by firebase token;
            FirebaseToken decodedToken = firebaseTokenService.verifyIdToken(idToken);
            System.out.println("decoded token : "+ decodedToken);

            //check it is present in database or not 
            UserEntity entity =  userRepository.findByPhoneNumber(request.getPhoneNumber());
            if(entity == null){
                String deliveryPin = String.valueOf(1000 + new Random().nextInt(9000));
                request.setDeliveryPin(deliveryPin);
                entity = userRepository.save(convertRequestToEntity(request));
                
            }else{
                entity = userRepository.save(entity);
            }

            // get jwt token 
            String jwtToken = jwtUtil.generateAccessToken(entity.getId(), List.of("ROLE_USER"));
            String refreshToken = jwtUtil.generateRefreshToken(entity.getId());
            

            //store refresh token in cookies
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                        .httpOnly(true)
                        .secure(false)
                        .sameSite("strict")
                        .path("/")
                        .maxAge(refreshTokenValidity)
                        .build();

            UserResponse response = covertEntityToResponse(entity);
            response.setJwtAccessToken(jwtToken);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        }
        catch (Exception e) {
           throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not Verify", e);
        }  
    }

    private UserEntity convertRequestToEntity(UserRequest request){
        return UserEntity.builder()
                .phoneNumber(request.getPhoneNumber())
                .deliveryPin(request.getDeliveryPin())
                .build();
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
    public ResponseEntity<UserResponse> refreshToNewAccessToken(String refreshToken) {
        try {
            if (!jwtUtil.validateRefreshToken(refreshToken)) {
      
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
            }

            String userId = jwtUtil.getUserIdFromRefreshToken(refreshToken);

            String newAccessToken = jwtUtil.generateAccessToken(userId, List.of("ROLE_USER"));

            UserEntity user = userRepository.findById(userId)
                                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            UserResponse response = covertEntityToResponse(user);
            response.setJwtAccessToken(newAccessToken);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No refresh token found");
        }
    }


    @Override
    public ResponseEntity<?> updateName(String userId, String name) {
        try {
            UserEntity user = userRepository.findById(userId)
                                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            user.setName(name);
            userRepository.save(user);
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL SERVER ERROR", e);
        }
    }
}
