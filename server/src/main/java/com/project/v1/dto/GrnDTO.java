package com.project.v1.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.v1.entity.Grnitem;
import com.project.v1.entity.Grnstatus;
import com.project.v1.entity.Purchaseorder;
import com.project.v1.entity.Supplier;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GrnDTO {
    private Integer id;
    private LocalDate doreceived;
    private BigDecimal grandtotal;
    private Purchaseorder purchaseorder;
    private Grnstatus grnstatus;
    private Supplier supplierIdsupplier;
    private Set<Grnitem> grnitems = new LinkedHashSet<>();

}
