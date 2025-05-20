package com.project.v1.dto;


import com.project.v1.entity.Employee;
import com.project.v1.entity.Poitem;
import com.project.v1.entity.Postatus;
import com.project.v1.entity.Supplier;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderDTO {
    private Integer id;
    private String number;
    private LocalDate doexpected;
    private BigDecimal expectedtotal;
    private String description;
    private LocalDate date;
    private Employee employee;
    private Postatus postatus;
    private Supplier supplierIdsupplier;
    private Set<Poitem> poitems;
}
