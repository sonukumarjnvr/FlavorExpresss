package com.example.foodies.service;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;

public interface OrderService {
    public ResponseEntity<?> getTodayOrders();
    public ResponseEntity<?> getYesterdayOrders();
    public ResponseEntity<?> getOrdersByDate(LocalDate date);
    public ResponseEntity<?> getOrdersBetweenDates(LocalDate startDate, LocalDate endDate);
    public ResponseEntity<?> getOrdersByUser(String userId);
    public ResponseEntity<?> getOrdersBetweenByUserId(String userId, LocalDate startDate, LocalDate endDate);
}
