 package com.example.foodies.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;


import com.example.foodies.DTO.FoodRequest;
import com.example.foodies.DTO.FoodResponse;
import com.example.foodies.entity.FoodEntity;

import org.springframework.beans.factory.annotation.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import com.example.foodies.repository.FoodRepository;



@Service
public class FoodServiceImp implements FoodService {
    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<String> uploadFile(List<MultipartFile> files) {
         List<String> uploadedList = new ArrayList<>(); 
      
        files.forEach(file ->{
                try {
                    String fileExetension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1);
                    String key = UUID.randomUUID().toString() + "." + fileExetension;
                    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .acl("public-read")
                            .contentType(file.getContentType())
                            .build();
                    
                    PutObjectResponse  responce = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
                    if(responce.sdkHttpResponse().isSuccessful()){
                        String url =  "https://" + bucketName + ".s3.amazonaws.com/" + key;
                        uploadedList.add(url);
                    }else{
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An Error occurs while uploading the files");
                    }
                } catch (IOException ex) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "file upload failed", ex);
                
                }

        });        
      return uploadedList;
    }

    @Override
    public FoodResponse addFood(FoodRequest request, List<MultipartFile> files) {
        FoodEntity newFoodEntity = convertFoodRequestToFoodEntity(request);
        
        List<String> imageUrl = uploadFile(files);
        
        newFoodEntity.setImageUrl(imageUrl);
        FoodEntity newFoodEntity2 = null;
        try {
            newFoodEntity2 = foodRepository.save(newFoodEntity);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while saving the food item in MongoDB", e);
        }
        return convertFoodEntityToFoodResponse(newFoodEntity2);
    }

    private FoodEntity convertFoodRequestToFoodEntity(FoodRequest request){
       return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .diet(request.getDiet())
                .build();
    }

    private FoodResponse convertFoodEntityToFoodResponse(FoodEntity entity){
        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .imageUrl(entity.getImageUrl())
                .diet(entity.getDiet())
                .build();
    }

    @Override
    public List<FoodResponse> readAllFoods() {    
        List<FoodEntity> foodEntities = foodRepository.findAll();
        return foodEntities.stream()
                .map(object -> convertFoodEntityToFoodResponse(object)).collect(Collectors.toList());
                
    }

    @Override
    public FoodResponse readFood(String id){
        FoodEntity foodEntity = foodRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Food item not found with id: " + id));
        return convertFoodEntityToFoodResponse(foodEntity);
        
    }

    @Override
    public boolean deleteFiles(List<String> fileUrls) {

        try {
            fileUrls.forEach(url ->{
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(url)
                    .build();

                s3Client.deleteObject(deleteObjectRequest);
            });

            return true;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while deleting the files from S3", e);
        }
      
    }

    @Override
    public boolean deleteFood(String id) {
        FoodResponse food = readFood(id);
        List<String> imageUrls = food.getImageUrl();
        imageUrls = imageUrls.stream()
                        .map(url -> url.substring(url.lastIndexOf("/") + 1))
                        .collect(Collectors.toList());
        boolean isDeleted = deleteFiles(imageUrls);
        if(isDeleted){
            foodRepository.deleteById(id);
            return true;
        }
        return false;   
    }

    @Override
    public FoodResponse editFood(String id, FoodRequest request, List<MultipartFile> newfiles) {
        List<String> previousfiles = request.getPreviousfiles();
        Optional<FoodEntity> food = foodRepository.findById(id);
        if(food.isPresent()){
            FoodEntity existingFood = food.get();
            List<String> existingFiles = existingFood.getImageUrl();
            List<String> deletedFiles = new ArrayList<>();
            for(String url : existingFiles){
                if(!previousfiles.contains(url)){
                    String key = url.substring(url.lastIndexOf("/") + 1);
                    deletedFiles.add(key);
                } 
            }

            boolean deletedFileFromS3 = deleteFiles(deletedFiles);

            if(deletedFileFromS3){
                List<String> newImageUrls = new ArrayList<>();
                if(!newfiles.isEmpty()){
                    newImageUrls = uploadFile(newfiles);
                }
                
                if(!previousfiles.isEmpty()){
                    newImageUrls.addAll(previousfiles);
                }
                
                existingFood.setName(request.getName());
                existingFood.setDescription(request.getDescription());
                existingFood.setCategory(request.getCategory());
                existingFood.setDiet(request.getDiet());
                existingFood.setImageUrl(newImageUrls);
                FoodEntity updatedFoodEntity = foodRepository.save(existingFood);
                return convertFoodEntityToFoodResponse(updatedFoodEntity);
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while deleting previous images from S3");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Food item not found with id: " + id);
        }
    }

    @Override
    public List<FoodResponse> getFoodsByCategoryName(String id) {
        try {
           
            List<FoodEntity> entities = foodRepository.findAllByCategory(id);
            if(entities.size() == 0){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Food item not found with category: " + id);
            }
           
            return entities.stream().map((object) -> convertFoodEntityToFoodResponse(object)).collect(Collectors.toList());
        }catch(ResponseStatusException ex){
            throw ex;
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to fetch food items from database " + id, e);
        }
    }

    @Override
    public ResponseEntity<?> getFoodsBySearch(String search, String category, String diet) {
        try {

            List<FoodEntity> foodList;
            if(search == null && category == null && diet == null){
                foodList = foodRepository.findAll();
                return ResponseEntity.ok().body(foodList);
            }

            Query query = new Query();
            if(search != null && !search.isEmpty()){
                query.addCriteria(Criteria.where("name").regex(search, "i"));
            }

            if(category != null && !category.isEmpty()){
                query.addCriteria(Criteria.where("category").is(category));
            }

            if(diet != null && !diet.isEmpty()){
                query.addCriteria(Criteria.where("diet").is(diet));
            }

            foodList = mongoTemplate.find(query, FoodEntity.class);
            if(foodList.size() > 0) return ResponseEntity.ok().body(foodList);
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error while Searching food", e);
        }
    }
    
}
