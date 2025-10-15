package com.example.foodies.service;

import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.foodies.DTO.SizeRequest;
import com.example.foodies.DTO.SizeResponse;
import com.example.foodies.entity.SizeEntity;
import com.example.foodies.repository.SizeRepository;


@Service
public class SizeServiceImp implements SizeService{
    @Autowired
    SizeRepository sizeRepository;

    @Override
    public SizeResponse addSize(SizeRequest request) {
        try {
            SizeEntity entity = convertRequestToEntity(request);
            entity = sizeRepository.save(entity);
            return convertEntityToResponse(entity);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to save data in mongoDB",  e);
        }
        
    }

    private SizeEntity convertRequestToEntity(SizeRequest request){
        return SizeEntity.builder()
            .foodId(request.getFoodId())
            .sizeName(request.getSizeName())
            .price(request.getPrice())
            .discount(request.getDiscount())
            .build();
    }

    private SizeResponse convertEntityToResponse(SizeEntity entity){
        return SizeResponse.builder()
                .id(entity.getId())
                .foodId(entity.getFoodId())
                .sizeName(entity.getSizeName())
                .price(entity.getPrice())
                .discount(entity.getDiscount())
                .build();
    }

    @Override
    public SizeResponse getSizeById(String id) {
        SizeEntity entity = sizeRepository.findById(id)
                        .orElseThrow(()-> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "cant not find size with id : " + id));

        return convertEntityToResponse(entity);
    }

    @Override
    public List<SizeResponse> getSizeByFoodId(String foodId) {
        try {
            List<SizeEntity> entities = sizeRepository.findAllByFoodId(foodId); 
            if(entities.size() == 0){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "sizes not found with foodId : " + foodId, null);
            }
            return entities.stream().map((object)-> convertEntityToResponse(object)).collect(Collectors.toList());
        }catch(ResponseStatusException ex){
            throw ex;
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", e);
        }
        
    }

    @Override
    public SizeResponse editSize(String id, SizeRequest request) {
        try {
            SizeEntity savedEntity = sizeRepository.findById(id)
                    .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "size not found in database with id " + id));
    
            savedEntity.setSizeName(request.getSizeName());
            savedEntity.setPrice(request.getPrice());
            savedEntity.setDiscount(request.getDiscount());
    
            savedEntity = sizeRepository.save(savedEntity);
            return convertEntityToResponse(savedEntity);
        } catch(ResponseStatusException ex){
            throw ex;
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", e);
        }
    }

    @Override
    public boolean deleteSize(String id) {
        try {
            sizeRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", e);
        }
    }

}
