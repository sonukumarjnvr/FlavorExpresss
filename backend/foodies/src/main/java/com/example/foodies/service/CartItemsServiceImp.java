package com.example.foodies.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.handler.ResponseStatusExceptionHandler;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.FindAndModifyOptions;

import com.amazonaws.services.xray.model.Http;
import com.example.foodies.DTO.CartItemModifyRequest;
import com.example.foodies.DTO.CartItemRequest;
import com.example.foodies.DTO.CartItemResponse;
import com.example.foodies.entity.CartItemsEntity;
import com.example.foodies.entity.Customization;
import com.example.foodies.repository.CartItemsRepository;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;


@Service
public class CartItemsServiceImp implements CartItemsService {

    @Autowired
    private CartItemsRepository cartItemsRepository;

    @Autowired
    private MongoTemplate mongoTemplate;


// add food in cart
    @Override
    public ResponseEntity<?> addCartItem(CartItemRequest request, String id) {
        try {

            CartItemsEntity newItem = convertRequestToEntity(request, id);
            Query query = new Query();
            query.addCriteria(Criteria.where("userId").is(id)
                    .and("foodId").is(newItem.getFoodId())
                    .and("size").is(newItem.getSize())
                    .and("customization").is(newItem.getCustomization()));

            CartItemsEntity item = mongoTemplate.findOne(query, CartItemsEntity.class);
            //if food is notpresent in mongoDB
            if(item == null){
                CartItemsEntity newAddedItem = mongoTemplate.insert(newItem);
                if(newAddedItem != null) return ResponseEntity.ok().body("Food Added Successfully");
                return ResponseEntity.internalServerError().body("Food could not be added");
            }
            else{
                //if food present already
                Update update = new Update().inc("count", +1);
                UpdateResult result = mongoTemplate.updateFirst(query, update, CartItemsEntity.class);

                System.out.println("count modifyed result : " + result.getModifiedCount());
                if(result.getModifiedCount() > 0) return ResponseEntity.ok().body("Food Added Successfully");
                return ResponseEntity.internalServerError().body("Food could not be added");
            }    

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while adding the cart item.", e);
        }
    }

    private CartItemResponse convertEntityToResponse(CartItemsEntity entity) {
        return CartItemResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .foodId(entity.getFoodId())
                .name(entity.getName())
                .size(entity.getSize())
                .count(entity.getCount())
                .price(entity.getPrice())
                .discount(entity.getDiscount())
                .imageUrl(entity.getImageUrl())
                .category(entity.getCategory())
                .description(entity.getDescription())
                .customization(entity.getCustomization())
                .build();
    }

    private CartItemsEntity convertRequestToEntity(CartItemRequest request, String userId) {
        return CartItemsEntity.builder()
                .userId(userId)
                .foodId(request.getFoodId())
                .name(request.getName())
                .size(request.getSize())
                .count(request.getCount())
                .price(request.getPrice())
                .discount(request.getDiscount())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .description(request.getDescription())
                .customization(request.getCustomization())
                .build();
    }

//get all cart items 
    @Override
    public ResponseEntity<?> getCartItems(String id) {
        try {
            List<CartItemsEntity> entities = cartItemsRepository.findByUserId(id);
            if(entities.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No cart items found for the user.");
            }
            List<CartItemResponse> responses = entities.stream()
                    .map((object) -> convertEntityToResponse(object)).collect(Collectors.toList());
            return ResponseEntity.ok().body(responses);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while retrieving cart items.", e);
        }
    }

//delete food by food id
    @Override
    public ResponseEntity<?> deleteCartItem(String id, CartItemModifyRequest request) {
        try {
            Query query = new Query();
            query.addCriteria(Criteria.where("userId").is(id)
                                .and("foodId").is(request.getFoodId())
                                .and("size").is(request.getSize())
                                .and("customization").is(request.getCustomization()));
            DeleteResult result = mongoTemplate.remove(query, CartItemsEntity.class);

             if(result.getDeletedCount() > 0){
                return ResponseEntity.ok().body("Food Items Deleted Successfully");
             }

             return ResponseEntity.internalServerError().body("Food Items is not Deleted");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", e);
        }
    }

// remove items from cart
    @Override
    public ResponseEntity<?> removeFromCart(String id, CartItemModifyRequest request) {
        try {
                // find item in mongoDB
            Query query = new Query();
            query.addCriteria(Criteria.where("userId").is(id)
                                        .and("foodId").is(request.getFoodId())
                                        .and("size").is(request.getSize())
                                        .and("customization").is(request.getCustomization())
                                        );

            CartItemsEntity item = mongoTemplate.findOne(query, CartItemsEntity.class);

            if(item == null) return ResponseEntity.notFound().build();
            if(item.getCount() > 1){
                Update update = new Update().inc("count", -1);
                UpdateResult result = mongoTemplate.updateFirst(query, update, CartItemsEntity.class);

                if(result.getModifiedCount() > 0) return ResponseEntity.ok().body("Food Items Remove Successfully");
                
            }
            else{
                DeleteResult result = mongoTemplate.remove(query, CartItemsEntity.class);
                if(result.getDeletedCount() > 0) return ResponseEntity.ok().body("Food Items Remove Successfully");
                
            }

            return ResponseEntity.internalServerError().body("Food items not deleted");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL SERVER ERROR ", e);
        }
    }

    
}
