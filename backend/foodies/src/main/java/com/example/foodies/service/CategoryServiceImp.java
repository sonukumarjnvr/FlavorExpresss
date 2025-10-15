package com.example.foodies.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import com.example.foodies.DTO.CategoryRequest;
import com.example.foodies.DTO.CategoryResponse;
import com.example.foodies.entity.CategoryEntity;
import com.example.foodies.repository.CategoryRepository;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.S3Client;

@Service
public class CategoryServiceImp implements CategoryService {
    @Autowired
    private S3Client s3Client;

    @Autowired
    CategoryRepository categoryRepository;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file) {
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
                return url;
            }else{
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An Error occurs while uploading the Category files");
            }

        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "file upload failed", ex);
        
        }
    }

    @Override
    public CategoryResponse addCategory(CategoryRequest request, MultipartFile file) {
        CategoryEntity entity = convertCategoryRequestCategoryEntity(request);
        String imageUrl = uploadFile(file);
        entity.setCategoryImageUrl(imageUrl);
        System.out.println("before :" + entity);

        try {
            entity = categoryRepository.save(entity);
            
            System.out.println("after :" + entity);
            return convertCategoryResponseToCategoryEntity(entity);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while saving the category item in MongoDB", e);
        }
    }

    private CategoryEntity convertCategoryRequestCategoryEntity(CategoryRequest request){
        return CategoryEntity.builder()
                .categoryName(request.getCategoryName())
                .build();
    }

    private CategoryResponse convertCategoryResponseToCategoryEntity(CategoryEntity entity){
        return CategoryResponse.builder()
                    .categoryName(entity.getCategoryName())
                    .id(entity.getId())
                    .categoryImageUrl(entity.getCategoryImageUrl())
                    .build();
    }

    @Override
    public List<CategoryResponse> findAllCategory(){
        try {
            List<CategoryEntity> entity = categoryRepository.findAll();
            return entity.stream().map((object)->(convertCategoryResponseToCategoryEntity(object))).collect(Collectors.toList());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Categrory is not feched from database ", e);
        }
    }


    @Override
    public CategoryResponse getCategory(String id) {
            CategoryEntity entity = categoryRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category is find in database with id : " + id));
        return convertCategoryResponseToCategoryEntity(entity);
    }

    public boolean deleteFile(String categoryImageUrl){
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(categoryImageUrl)
                    .build();
        
            s3Client.deleteObject(deleteObjectRequest);
            return true;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error occur while deleting file : " + e);
        }
    }

    @Override
    public boolean deleteCategory(String id) {
        try {
            CategoryResponse response = getCategory(id);
            String categoryImageUrl = response.getCategoryImageUrl();
            categoryImageUrl = categoryImageUrl.substring(categoryImageUrl.lastIndexOf("/") + 1);
            
            boolean deleted = deleteFile(categoryImageUrl);
            if(deleted){
                categoryRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "categrory is not deleleted from database", e);
        }
        
    }

    @Override
    public CategoryResponse edit(String id, CategoryRequest request, MultipartFile newfile){
        String previousfile = request.getPreviousImageUrl();
        if(previousfile != "" && newfile == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please upload atleast one image");
        }
        
        Optional<CategoryEntity> savedCategory = categoryRepository.findById(id);
        if(savedCategory.isPresent()){
            CategoryEntity savedEntity = savedCategory.get();
            String url;
            boolean deleted = false;
            if(previousfile != ""){
                url = previousfile.substring(previousfile.lastIndexOf("/") + 1);
                deleted = deleteFile(url);
            } 
    
            if(deleted){
                String newUrl = uploadFile(newfile);
                savedEntity.setCategoryImageUrl(newUrl);
            }
            savedEntity.setCategoryName(request.getCategoryName());
            savedEntity = categoryRepository.save(savedEntity);
            return convertCategoryResponseToCategoryEntity(savedEntity);

        }
        else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "category id not found with id : " + id);
        }
    }

}
