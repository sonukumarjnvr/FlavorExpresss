package com.example.foodies.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.foodies.DTO.SizeRequest;
import com.example.foodies.DTO.SizeResponse;
import com.example.foodies.service.SizeService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/size")
public class SizeController {
    @Autowired
    SizeService sizeService;

    @PostMapping("/addSize")
    public SizeResponse addSize(@Valid @RequestBody SizeRequest request) {
        System.out.println(request);
        return sizeService.addSize(request);
    }

    @GetMapping("/{id}")
    public SizeResponse getSizeById(@PathVariable String id) {
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please enter valid size id");
        }
        return sizeService.getSizeById(id);
    }

    @GetMapping("/foodId/{foodId}")
    public List<SizeResponse> getSizeByFoodId(@PathVariable String foodId) {
        if(foodId == null || foodId.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please enter valid size id");
        }
        System.out.println(foodId);
        return sizeService.getSizeByFoodId(foodId);
    } 
    
    @PutMapping("/editSize/{id}")
    public SizeResponse editSize(@PathVariable String id, @Valid @RequestBody SizeRequest request) {
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please enter valid size id");
        }
        return sizeService.editSize(id, request);
    }

    @DeleteMapping("/deleteSize/{id}")
    public boolean deleleSize(@PathVariable String id){
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please enter valid size id");
        }

        return sizeService.deleteSize(id);
    }
    
}
