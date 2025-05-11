package com.project.v1.controller;

import com.project.v1.dto.CategoryDTO;
import com.project.v1.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoriesController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryDTO> getAll(){
        return categoryService.getAll();
    }
}
