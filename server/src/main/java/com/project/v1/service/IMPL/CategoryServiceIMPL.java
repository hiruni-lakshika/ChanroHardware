package com.project.v1.service.IMPL;

import com.project.v1.dto.CategoryDTO;
import com.project.v1.entity.Category;
import com.project.v1.exception.ResourceNotFoundException;
import com.project.v1.repository.CategoryRepository;
import com.project.v1.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceIMPL implements com.project.v1.service.CategoryService{

    private final ObjectMapper objectMapper;
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDTO> getAll() {
        List<Category> categories = categoryRepository.findAll();
        if(!categories.isEmpty()){
            return objectMapper.categoryListToDtoList(categories);
        }else{
            throw new ResourceNotFoundException("Categories Not Found!");
        }
    }
}
