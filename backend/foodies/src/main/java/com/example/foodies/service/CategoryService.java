package com.example.foodies.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.foodies.DTO.CategoryRequest;
import com.example.foodies.DTO.CategoryResponse;

public interface CategoryService {
    public String uploadFile(MultipartFile file);
    public CategoryResponse addCategory(CategoryRequest request, MultipartFile file);
    public List<CategoryResponse> findAllCategory();
    public boolean deleteCategory(String id);
    public CategoryResponse getCategory(String id);
    public CategoryResponse edit(String id, CategoryRequest request, MultipartFile newfiles);
}
