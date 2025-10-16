package com.example.foodies.service;

import java.io.IOException;

import org.springframework.http.ResponseEntity;


import jakarta.servlet.http.HttpServletResponse;

public interface OAuth2Service {
    public void redirectToGoogle(HttpServletResponse response);
    public void googleCallback(String code, HttpServletResponse response) throws IOException;
    public ResponseEntity<?> getRefreshToken(String acccessToken);
}
