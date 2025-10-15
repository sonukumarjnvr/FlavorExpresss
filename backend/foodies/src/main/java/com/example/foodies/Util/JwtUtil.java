package com.example.foodies.Util;

import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import org.springframework.stereotype.Component;

import java.util.*;

import io.jsonwebtoken.*;


@Component
public class JwtUtil {

    @Value("${jwt.secretKey}")
    private  String accessSecretKey;

    @Value("${jwt.refreshSecretKey}")
    private String refreshSecretKey;

    @Value("${jwt.accessTokenValidity}")
    private long accessTokenValidity;

    @Value("${jwt.refreshTokenValidity}")
    private long refreshTokenValidity;

    private Key getAccessSigningKey() {
        return Keys.hmacShaKeyFor(accessSecretKey.getBytes());
    }

    private Key getRefreshSigningKey(){
        return Keys.hmacShaKeyFor(refreshSecretKey.getBytes());
    }

    public String generateAccessToken(String UserId, List<String> roles) {
        return Jwts.builder()
                .setSubject(UserId)
                .claim("roles", roles)
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity))
                .signWith(getAccessSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractUserId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getAccessSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

//extract role
    public List<String> getRoles(String token){
        Claims claims = getClaims(token);
        return claims.get("roles", List.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getAccessSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private Claims getClaims(String token){
        return Jwts.parser()
                .setSigningKey(getAccessSigningKey())
                .parseClaimsJws(token)
                .getBody();
    }

// generate Refresh token 
    public String generateRefreshToken(String UserId) {
        return Jwts.builder()
                .setSubject(UserId)
                .claim("type", "refresh")
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
                .signWith(getRefreshSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

// Validate refresh token
    public boolean validateRefreshToken(String refreshToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getRefreshSigningKey())
                .build()
                .parseClaimsJws(refreshToken);  // parses and validates
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Refresh Token expired: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Invalid Refresh Token: " + e.getMessage());
        }
        return false;
    }

// Extract UserId from refresh token
    public String getUserIdFromRefreshToken(String refreshToken) {
        return Jwts.parserBuilder()
                .setSigningKey(getRefreshSigningKey())
                .build()
                .parseClaimsJws(refreshToken)
                .getBody()
                .getSubject(); // subject = UserId
    }



}
