package com.example.foodies.exception;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.example.foodies.DTO.ErrorResponse;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    // ===================== Database Exceptions =====================
    
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Object> handleDatabaseException(DataAccessException ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Database error occurred", ex);
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<Object> handleDuplicateKeyException(DuplicateKeyException ex) {
        return buildResponse(HttpStatus.CONFLICT, "Duplicate entry: Food item already exists", ex);
    }

    // ===================== AWS S3 File Upload Exceptions =====================
    
      // Handle AWS Service Exceptions (S3 issues like bucket not found, access denied, etc.)
    @ExceptionHandler(AmazonServiceException.class)
    public ResponseEntity<Object> handleAmazonServiceException(AmazonServiceException ex) {
        return buildResponse(HttpStatus.BAD_GATEWAY, "AWS S3 Service error occurred", ex);
    }

    // Handle SDK Client Exceptions (network errors, invalid credentials, etc.)
    @ExceptionHandler(SdkClientException.class)
    public ResponseEntity<Object> handleSdkClientException(SdkClientException ex) {
        return buildResponse(HttpStatus.SERVICE_UNAVAILABLE, "AWS S3 Client error occurred", ex);
    }

    // Handle File Upload IO Exceptions
    @ExceptionHandler(IOException.class)
    public ResponseEntity<Object> handleIOException(IOException ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "File processing error", ex);
    }

    // ===================== Custom Exceptions =====================
    
    @ExceptionHandler(FoodNotFoundException.class)
    public ResponseEntity<Object> handleFoodNotFound(FoodNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
    }

    // ===================== Spring's ResponseStatusException =====================
    
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex) {
        return buildResponse(HttpStatus.valueOf(ex.getStatusCode().value()), ex.getReason(), ex);
    }

    // ===================== Generic Catch-All =====================
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", ex);
    }

    // ===================== Utility for Consistent JSON Response =====================
    
    private ResponseEntity<Object> buildResponse(HttpStatus status, String message, Exception ex) {
        ErrorResponse body = new ErrorResponse(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            ex.getMessage()
        );

        return new ResponseEntity<>(body, status);
    }
}
