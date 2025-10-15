package com.example.foodies.controller;

import java.io.IOException;
import java.util.List;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import com.example.foodies.DTO.CategoryRequest;
import com.example.foodies.DTO.CategoryResponse;
import com.example.foodies.service.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/category")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;

    @PostMapping("/addCategory")
    public CategoryResponse addCategory( @RequestPart("categoryName") String categoryName, @RequestPart("file") MultipartFile file) throws IOException {
    // check for valid file format
        if(file.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please upload atleast one file");
        }

        long totalSize = file.getSize();
        if(totalSize > 10 * 1024 * 1024){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please upload valid file whitin 3MB");
        }

        Tika tika = new Tika();
        String detectedFileType = tika.detect(file.getInputStream());
        if(!(detectedFileType.equals("image/jpeg") || 
            detectedFileType.equals("image/jpg") || 
            detectedFileType.equals("image/png"))){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please upload valid file format(jpp/jpeg/png)");
        }

        //check for valid dietName
        if(categoryName == null || categoryName.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please enter valid name");
        }

        ObjectMapper mapper = new ObjectMapper();
        CategoryRequest request = null;
        try {
            request = mapper.readValue(categoryName, CategoryRequest.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid json format", e);
        }

        CategoryResponse response = categoryService.addCategory(request, file);

        return response;
    }

    @GetMapping("/allCategory")
    public List<CategoryResponse> getAllCategory() {
        return categoryService.findAllCategory();
    }

    @GetMapping("/{id}")
    public CategoryResponse getMethodName(@PathVariable String id) {
        if(id.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please provide cateory id");
        return   categoryService.getCategory(id);
    }
    
    @DeleteMapping("/{id}")
    public boolean deleteCategory(@PathVariable String id){
        if(id.isEmpty()) return false;
        System.out.println(id);
        return categoryService.deleteCategory(id);
    }
    
    @PutMapping("editCategory/{id}")
    public CategoryResponse editCategory(@PathVariable String id, @RequestPart("categoryName") String categoryName, @RequestPart(value = "file", required = false) MultipartFile newfile){
        
        if(id == null || id.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "category id is required" );
        //check for valid categoryName
        if(categoryName == null || categoryName.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please enter valid name");
        }

        System.out.println(categoryName);
        
        if (newfile != null && !newfile.isEmpty()){
             long totalSize = newfile.getSize();
            if(totalSize > 10 * 1024 * 1024){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please upload valid file whitin 3MB");
            }

            Tika tika = new Tika();
            String detectedFileType;
            try {
                detectedFileType = tika.detect(newfile.getInputStream());
                if(!(detectedFileType.equals("image/jpeg") || 
                detectedFileType.equals("image/jpg") || 
                detectedFileType.equals("image/png"))){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "please upload valid file format(jpp/jpeg/png)");
            }
            } catch (IOException e) {
                
                e.printStackTrace();
            }
       
        }
       
        

        ObjectMapper mapper = new ObjectMapper();
        CategoryRequest request = null;
        try {
            request = mapper.readValue(categoryName, CategoryRequest.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid json format", e);
        }

        CategoryResponse response = categoryService.edit(id, request, newfile);
        return response;
    }
    
}
