package com.example.foodies.entity;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

public class OrderEntity {
    private String orderId;
    private String orderNo;
    private List<String> foodIdies;
    private String userId;
    private double discountedAmount;
    private double totalAmount;
    private String deliveryAddress;
    private String status;
    private Date date;
    private Time time;
}
