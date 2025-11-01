package com.example.foodies.service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.foodies.entity.OrderEntity;
import com.example.foodies.repository.OrderRepository;

@Service
public class OrderServiceImp implements OrderService {

    private final MongoTemplate mongoTemplate;
    private final OrderRepository orderRepository;

    public OrderServiceImp(MongoTemplate mongoTemplate, OrderRepository orderRepository){
        this.mongoTemplate = mongoTemplate;
        this.orderRepository = orderRepository;
    }


    private ResponseEntity<?> getOrdersBetween(LocalDateTime start, LocalDateTime end){
        try {
            Query query = new Query();
            query.addCriteria(Criteria.where("orderDate").gte(start).lte(end));
            List<OrderEntity> entities = mongoTemplate.find(query, OrderEntity.class);
    
            return ResponseEntity.ok().body(entities);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error to Find Orders", e);
        }
    }

    @Override
    public ResponseEntity<?> getTodayOrders() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1).minusSeconds(1);
        return getOrdersBetween(start, end);
    }


    @Override
    public ResponseEntity<?> getYesterdayOrders() {
        LocalDateTime start = LocalDate.now().minusDays(1).atStartOfDay();
        LocalDateTime end = start.plusDays(1).minusSeconds(1);
        return getOrdersBetween(start, end);
    }


    @Override
    public ResponseEntity<?> getOrdersByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = start.plusDays(1).minusSeconds(1);
        return getOrdersBetween(start, end);
    }


    @Override
    public ResponseEntity<?> getOrdersBetweenDates(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.plusDays(1).atStartOfDay().minusSeconds(1);
        return getOrdersBetween(start, end);
    }


    @Override
    public ResponseEntity<?> getOrdersByUser(String userId) {
        try {
            List<OrderEntity> entities = orderRepository.findAllByUserId(userId);
            return ResponseEntity.ok().body(entities);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error during Find Orders", e);
        }
    }

    private ResponseEntity<?> getOrdersFilterByUserId(String status, LocalDateTime start, LocalDateTime end, String userId){
        try {
            Query query = new Query();
            if("PLACED".equals(status)){
                query.addCriteria(Criteria.where("userId").is(userId)
                    .and("orderStatus").nin(Arrays.asList("DELIVERED", "CANCELED"))
                    .and("orderDateTime").gte(start).lte(end));
            }
            else{
                query.addCriteria(Criteria.where("userId").is(userId)
                    .and("orderStatus").is(status)
                    .and("orderDateTime").gte(start).lte(end));
            }
    
            List<OrderEntity> entities = mongoTemplate.find(query, OrderEntity.class);
            return ResponseEntity.ok().body(entities);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error during Find Orders", e);
        }
    }

    @Override
    public ResponseEntity<?> getOrdersFilterByUserId(String userId, String status, LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.plusDays(1).atStartOfDay().minusSeconds(1);
        return getOrdersFilterByUserId(status, start, end, userId);
    }

    @Override
    public ResponseEntity<?> cancelOrderByUserId(String userId, String orderId) {
        try {
            Query query = new Query();
            query.addCriteria(Criteria.where("userId").is(userId)
                                  .and("id").is(orderId));

            OrderEntity order = mongoTemplate.findOne(query, OrderEntity.class);

            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No order found for given userId and orderId");
            }

            //Allow cancellation only if current status is "PLACED"
            if (!"PLACED".equalsIgnoreCase(order.getOrderStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Order cannot be canceled because it is already " + order.getOrderStatus());
            }

            Update update = new Update();
            update.set("orderStatus", "CANCELED");
            update.set("paymentStatus", "REFUND INITIATED");
            mongoTemplate.updateFirst(query, update, OrderEntity.class);

            return ResponseEntity.ok("Order canceled successfully");
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Internal Server Error during canceling order", 
                    e
            );
        }
    }


    @Override
    public ResponseEntity<?> getOrderByOrderId(String userId, String orderId) {
        try {
            System.out.println("order Id : " + orderId);
            OrderEntity entity = orderRepository.findById(orderId)
                                    .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
            return ResponseEntity.ok().body(entity);
            
        } catch (Exception e) {
           throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", e);
        }
    }

}
