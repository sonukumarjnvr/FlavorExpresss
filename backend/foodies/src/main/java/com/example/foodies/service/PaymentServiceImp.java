package com.example.foodies.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.digest.HmacUtils;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import com.example.foodies.DTO.OrderRequest;
import com.example.foodies.DTO.OrderResponse;
import com.example.foodies.entity.OrderEntity;
import com.example.foodies.repository.OrderRepository;
import com.google.api.client.util.Value;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;


public class PaymentServiceImp implements PaymentService {

    private final OrderRepository orderRepository;

    public PaymentServiceImp(OrderRepository orderRepository){
        this.orderRepository = orderRepository;
    }

    @Value("${keyId}")
    private String keyId;

    @Value("${secretKey}")
    private String keySecret;

    private Order createRazorpayOrder(double totalAmount, String receiptId){
       try {
         RazorpayClient client = new RazorpayClient(keyId, keySecret);
         JSONObject orderRequest = new JSONObject();
 
         orderRequest.put("totalAmount", (int)(totalAmount * 100)); // in paise
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
            entity.setStatus("CREATED");
            entity =  orderRepository.save(entity);

            //create razor pay order
            Order razorPayOrder = createRazorpayOrder(entity.getTotalAmount(), entity.getId());
            entity.setRazorpayOrderId(razorPayOrder.get("id"));
            entity.setStatus("PENDING");
            entity =  orderRepository.save(entity);

            OrderResponse response = convertEntityToResponse(entity);

            response.setCurrency(razorPayOrder.get("currency"));
            response.setKeyId(keyId);

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
                .build();
    }

    private OrderResponse convertEntityToResponse(OrderEntity entity){
        return OrderResponse.builder()
                    .totalAmount(entity.getTotalAmount())
                    .razorpayOrderId(entity.getRazorpayOrderId())
                    .id(entity.getId())
                    .build();
    }

    @Override
    public ResponseEntity<?> verifyPayment(Map<String, String> data) {
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
                entity.setStatus("PAID");
                orderRepository.save(entity);
                response.put("status" , "success");
                response.put("message", "Payment verified successfully.");
                return ResponseEntity.ok().body(response);
            }
            else{
                entity.setStatus("FAILED");
                orderRepository.save(entity);
                response.put("status", "failed");
                response.put("message", "Payment verification failed.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", e);
        }
    }

}
