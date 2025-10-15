package com.example.foodies.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.*;

import com.example.foodies.DTO.FoodRequest;
import com.example.foodies.DTO.FoodResponse;
import com.example.foodies.service.FoodService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private  FoodService foodService;
    
    @PostMapping
    public FoodResponse AddFood(@RequestPart("food") String foodString, @RequestPart("files") List<MultipartFile> files) {
           
         // 1. Calculate total size
        long totalSize = files.stream().mapToLong(MultipartFile::getSize).sum();

        if (totalSize > 50 * 1024 * 1024) { 
            throw new RuntimeException("Total files size exceeds 50MB!");
        }

    
        ObjectMapper objectMapper = new ObjectMapper();
        
        FoodRequest request =  null;
        try {
            request = objectMapper.readValue(foodString, FoodRequest.class);
            
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid json format", e);
        }

        FoodResponse response = foodService.addFood(request, files);
        
        return response;    
    }

    @GetMapping("/allFoods")
    public List<FoodResponse> getAllFoods() {
        return foodService.readAllFoods();
    }

    @GetMapping("/{id}")
    public FoodResponse getFoodById(@PathVariable String id){
        System.out.println("get food controller is called : " + id);
        return foodService.readFood(id);
    }

    @DeleteMapping("/{id}")
    public boolean deleteFood(@PathVariable String id){
        return foodService.deleteFood(id);
    }

    @PutMapping("/editFood/{id}")
    public FoodResponse editFood(@PathVariable String id, @RequestPart("food") String foodString, @RequestPart(value = "newfiles", required = false) List<MultipartFile> newfiles){
        if (newfiles == null){
            newfiles = new ArrayList<MultipartFile>(); 
        }
        long totalSize = newfiles.stream().mapToLong(MultipartFile::getSize).sum();
        
        if (totalSize > 50 * 1024 * 1024) { 
            throw new RuntimeException("Total files size exceeds 50MB!");
        }
        

        ObjectMapper objectMapper = new ObjectMapper();
        FoodRequest request = null;
        try{
            request = objectMapper.readValue(foodString, FoodRequest.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid json format", e);
        }
       
        if (request.getPreviousfiles() == null) {
            request.setPreviousfiles(new ArrayList<>()); // empty list
        }

        FoodResponse response = foodService.editFood(id, request, newfiles);
        return response;

    }

    @GetMapping("/getFoodByCategory/{id}")
    public List<FoodResponse> getFoodsByCategoryName(@PathVariable String id) {
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "please enter valid id");
        }

        return foodService.getFoodsByCategoryName(id);
    }

    @GetMapping("/search")
    public ResponseEntity<?> getFoodsBySearch(
        @RequestParam(required = false) String query, 
        @RequestParam(required = false) String category, 
        @RequestParam(required = false) String diet) {
            System.out.println("controller called in search :  " + query + " " + category + " " + diet + " heloo");
        return foodService.getFoodsBySearch(query, category, diet);
    }
    
    
}
