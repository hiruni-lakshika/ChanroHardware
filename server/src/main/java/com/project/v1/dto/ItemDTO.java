package com.project.v1.dto;

import com.project.v1.entity.Subcategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemDTO {
    private Integer id;
    private String name;
    private BigDecimal cost;
    private Subcategory subcategory;
}

