package com.example.foodies.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.foodies.service.OrderService;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderService orderService;

    public OrderController(OrderService orderService){
        this.orderService = orderService;
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodayOrders() {
        return orderService.getTodayOrders();
    }

    @GetMapping("/yesterday")
    public ResponseEntity<?> getYesterdayOrders() {
        return orderService.getYesterdayOrders();
    }

    @GetMapping("/by-date")
    public ResponseEntity<?> getOrdersByDate(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if(date == null){
           return ResponseEntity.badRequest().body("Date is required");
        }

        return orderService.getOrdersByDate(date);
    }

    @GetMapping("/between")
    public ResponseEntity<?> getOrdersBetweenDates(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
            
        if(startDate == null || endDate == null){
            return ResponseEntity.badRequest().body("startDate and endDate both are required");
        }
        return orderService.getOrdersBetweenDates(startDate, endDate);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable String userId) {
        if(userId == null || userId.length() == 0){
            return ResponseEntity.badRequest().body("userId is required");
        }
        return orderService.getOrdersByUser(userId);
    }
    
    @GetMapping("/user/{userId}/between")
    public ResponseEntity<?> getOrdersBetweenByUser(
            @PathVariable String userId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if(userId == null || userId.length() == 0){
            return ResponseEntity.badRequest().body("userId is required");
        }
        return orderService.getOrdersBetweenByUserId(userId, startDate, endDate);
    }
}
