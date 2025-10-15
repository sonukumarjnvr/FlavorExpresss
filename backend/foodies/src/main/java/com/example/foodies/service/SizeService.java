package com.example.foodies.service;

import java.util.List;

import com.example.foodies.DTO.SizeRequest;
import com.example.foodies.DTO.SizeResponse;

public interface SizeService {
    public SizeResponse addSize(SizeRequest request);
    public SizeResponse getSizeById(String id);
    public List<SizeResponse> getSizeByFoodId(String foodId);
    public SizeResponse editSize(String id, SizeRequest request);
    public boolean deleteSize(String id);
}
