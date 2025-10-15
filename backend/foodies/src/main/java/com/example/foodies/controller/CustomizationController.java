package com.example.foodies.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.foodies.DTO.CustomizationRequest;
import com.example.foodies.DTO.CustomizationResponse;
import com.example.foodies.service.CustomizationService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/customization")
public class CustomizationController {
    @Autowired
    CustomizationService customizationService;

    @PostMapping("/addCustomization")
    public CustomizationResponse postMethodName(@Valid @RequestBody CustomizationRequest request) {
        
        return customizationService.addCustomization(request);
    }

    @GetMapping("/{id}")
    public CustomizationResponse getCustomization(@PathVariable String id) {
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please Enter valid customization ", null);
        }
        return customizationService.getCustomization(id);
    }
    
    @GetMapping("/getByCategory/{categoryId}")
    public List<CustomizationResponse> getCustomizationByCategory(@PathVariable String categoryId) {
        System.out.println("Category ID received in controller: " + categoryId);
        if(categoryId == null || categoryId.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please select any category" ,null);
        }

        return customizationService.getCustomizationByCategory(categoryId);
    }

    @DeleteMapping("/deleteCustomization/{id}")
    public boolean deleteCustomization(@PathVariable String id){
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please select any category" ,null);
        }

        return customizationService.deleteCustomization(id);
    }
    
    @PutMapping("/editCustomization/{id}")
    public CustomizationResponse editCustomization(@PathVariable String id, @Valid @RequestBody CustomizationRequest request) {
        return customizationService.editCustomization(id, request);
    }

}
