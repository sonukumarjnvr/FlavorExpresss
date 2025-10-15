package com.example.foodies.service;

import java.util.List;

import com.example.foodies.DTO.CustomizationRequest;
import com.example.foodies.DTO.CustomizationResponse;


public interface CustomizationService {
    public CustomizationResponse addCustomization(CustomizationRequest request);
    public CustomizationResponse getCustomization(String id);
    public List<CustomizationResponse> getCustomizationByCategory(String categoryId);
    public boolean deleteCustomization(String id);
    public CustomizationResponse editCustomization(String id, CustomizationRequest request);
}
