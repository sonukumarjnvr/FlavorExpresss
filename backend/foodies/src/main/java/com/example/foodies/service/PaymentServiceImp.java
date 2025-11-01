package com.example.foodies.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.digest.HmacUtils;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.foodies.DTO.OrderRequest;
import com.example.foodies.DTO.OrderResponse;
import com.example.foodies.entity.OrderEntity;
import com.example.foodies.entity.UserEntity;
import com.example.foodies.repository.CartItemsRepository;
import com.example.foodies.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;

@Service
public class PaymentServiceImp implements PaymentService {

    private final OrderRepository orderRepository;

    private final CartItemsRepository cartItemsRepository;
    private final MongoTemplate mongoTemplate;
    
    private final SequenceGeneratorService sequenceGenerator;

    public PaymentServiceImp(OrderRepository orderRepository, CartItemsRepository cartItemsRepository, MongoTemplate mongoTemplate, SequenceGeneratorService sequenceGenerator){
        this.orderRepository = orderRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.mongoTemplate = mongoTemplate;
        this.sequenceGenerator = sequenceGenerator;
    }

    @Value("${keyId}")
    private String keyId;

    @Value("${secretKey}")
    private String keySecret;

    private Order createRazorpayOrder(double amount, String receiptId){
       try {
        System.out.println("Razorpay order created: " + keyId + " " + keySecret);
         RazorpayClient client = new RazorpayClient(keyId, keySecret);
         JSONObject orderRequest = new JSONObject();
        

         orderRequest.put("amount", (int)(amount * 100)); // in paise
         orderRequest.put("currency", "INR");
         orderRequest.put("receipt", receiptId);
         orderRequest.put("payment_capture", 1);
 
         return client.orders.create(orderRequest);

       } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Order not generated", e);
       }
    }

    @Override
    public ResponseEntity<?> createOrder(OrderRequest request){
        try{
            OrderEntity entity = convertRequestToEntity(request);
            entity.setPaymentStatus("CREATED");
            entity = orderRepository.save(entity);

            //create razor pay order
            Order razorPayOrder = createRazorpayOrder(entity.getTotalAmount(), entity.getId());
            entity.setRazorpayOrderId(razorPayOrder.get("id"));
            entity.setPaymentStatus("PENDING");
            // Generate order ID
            long seq = sequenceGenerator.getNextSequence("orderNo");
            String orderNo = String.format("ORD-%05d", seq);
            entity.setOrderNo(orderNo);
            entity.setOrderDateTime(LocalDateTime.now());
            entity.setKeyId(keyId);
            entity.setCurrency(razorPayOrder.get("currency"));

            System.out.println("entity in service : " + entity);
            entity = orderRepository.save(entity);

            OrderResponse response = convertEntityToResponse(entity);

            return ResponseEntity.ok().body(response);
        }catch(Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", e);
        }
    }

    private OrderEntity convertRequestToEntity(OrderRequest request){
        return OrderEntity.builder()
                .userId(request.getUserId())
                .address(request.getAddress())
                .items(request.getItems())
                .totalAmount(request.getTotalAmount())
                .phone((request.getPhone()))
                .imageUrl(request.getItems().get(0).getImageUrl())
                .build();
    }

    private OrderResponse convertEntityToResponse(OrderEntity entity){
        return OrderResponse.builder()  
                .totalAmount(entity.getTotalAmount())
                .razorpayOrderId(entity.getRazorpayOrderId())
                .id(entity.getId())
                .OrderNo(entity.getOrderNo())
                .orderDateTime(entity.getOrderDateTime())
                .imageUrl(entity.getImageUrl())
                .currency(entity.getCurrency())
                .keyId(entity.getKeyId())
                .build();
    }

    // methods to Add order address
    public void addAddressToUser(String userId, String newAddress) {
        Query query = new Query(Criteria.where("id").is(userId));
        Update update = new Update().addToSet("address", newAddress); // prevents duplicates
        mongoTemplate.updateFirst(query, update, UserEntity.class);
    }

    @Override
    public ResponseEntity<?> verifyPayment(Map<String, String> data, String userId) {
        try {

            String razorpayOrderId = data.get("razorpay_order_id");
            String razorpayPaymentId = data.get("razorpay_payment_id");
            String razorpaySignature = data.get("razorpay_signature");

            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            String expectedSignature = HmacUtils.hmacSha256Hex(keySecret, payload);

            OrderEntity entity = orderRepository.findByRazorpayOrderId(razorpayOrderId);

            Map<String, String> response= new HashMap<>();
            
            if(expectedSignature.equals(razorpaySignature)){
                entity.setRazorpayPaymentId(razorpayPaymentId);
                entity.setRazorpaySignature(razorpaySignature);
                entity.setPaymentStatus("PAID");
                entity.setOrderStatus("PLACED");
                orderRepository.save(entity);

                //delete all cart items from cartItems of the user
                cartItemsRepository.deleteByUserId(userId);

                // add address to user Entity
                addAddressToUser(userId, entity.getAddress());

                response.put("status" , "success");
                response.put("message", "Payment verified successfully.");
                return ResponseEntity.ok().body(response);
            }
            else{
                entity.setPaymentStatus("FAILED");
                orderRepository.save(entity);
                response.put("status", "failed");
                response.put("message", "Payment verification failed.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", e);
        }
    }

    @Override
    public ResponseEntity<?> paymentInfo(String paymentId) {
        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            Payment payment = client.payments.fetch(paymentId);
            JSONObject json = payment.toJson();
            return ResponseEntity.ok().body(json.toString());   
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", e);
        }
    }

}
