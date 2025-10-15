package com.example.foodies.service;


import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.foodies.DTO.CustomizationRequest;
import com.example.foodies.DTO.CustomizationResponse;
import com.example.foodies.entity.CustomizationEntity;
import com.example.foodies.repository.CustomizationRepository;


@Service
public class CustomizationServiceImp implements CustomizationService {

    @Autowired
    CustomizationRepository customizationRepository;

    @Override
    public CustomizationResponse addCustomization(CustomizationRequest request) {
        try {
            CustomizationEntity entity = convertRequestToEntity(request); 
            entity = customizationRepository.save(entity);
            return convertEntityToResponse(entity);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Customization is not added to database", e);
        }
    }

    private CustomizationEntity convertRequestToEntity(CustomizationRequest request){
      return  CustomizationEntity.builder()
                .categoryId(request.getCategoryId())
                .customizationName(request.getCustomizationName())
                .type(request.getType())
                .price(request.getPrice())
                .build();
    }

    private CustomizationResponse convertEntityToResponse(CustomizationEntity entity){
        return CustomizationResponse.builder()
                .id(entity.getId())
                .categoryId(entity.getCategoryId())
                .customizationName(entity.getCustomizationName())
                .type(entity.getType())
                .price(entity.getPrice())
                .build();
    }

    @Override
    public CustomizationResponse getCustomization(String id) {
        try {
            CustomizationEntity entity = customizationRepository.findById(id)
                .orElseThrow(()->(new ResponseStatusException(HttpStatus.NOT_FOUND, "customization is not found with id :" + id, null)));
            return convertEntityToResponse(entity);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Not able to fetch data from database", e);
        }
    }

    @Override
    public List<CustomizationResponse> getCustomizationByCategory(String categoryId) {
        try {
            System.out.println("Category ID received in service: " + categoryId);
            List<CustomizationEntity> entity = customizationRepository.findAllByCategoryId(categoryId);
            if(entity.size() == 0){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "customizations not found with categoryId : " + categoryId, null);
            }

            return entity.stream().map((object)-> convertEntityToResponse(object)).collect(Collectors.toList());

        }catch(ResponseStatusException ex){
            throw ex;
        }catch (Exception e) {
           throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Not able to fetch data from database", e);
        }
        
    }

    @Override
    public boolean deleteCustomization(String id) {
        try {
            customizationRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "unble to do operation on database");
        }
    }

    @Override
    public CustomizationResponse editCustomization(String id, CustomizationRequest request) {
        try {
            CustomizationEntity savedResponse = customizationRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "customization with id not found"));

                savedResponse.setCustomizationName(request.getCustomizationName());
                savedResponse.setPrice(request.getPrice());
                savedResponse.setType(request.getType());

            savedResponse =  customizationRepository.save(savedResponse);  
            
            return convertEntityToResponse(savedResponse);
        } catch (Exception e) {
           throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "unble to do fetch data from database");
        }
    }

}
