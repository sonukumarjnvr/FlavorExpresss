package com.example.foodies.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.example.foodies.DTO.FoodRequest;
import com.example.foodies.DTO.FoodResponse;

public interface FoodService{
   List<String> uploadFile(List<MultipartFile> file);
   boolean deleteFiles(List<String> fileUrls);
   FoodResponse addFood(FoodRequest request, List<MultipartFile> file);
   List<FoodResponse> readAllFoods();
   FoodResponse readFood(String id);
   boolean deleteFood(String id);
   FoodResponse editFood(String id, FoodRequest request, List<MultipartFile> newfiles);
   List<FoodResponse> getFoodsByCategoryName(String id);
   ResponseEntity<?> getFoodsBySearch(String search, String category, String diet);
}
