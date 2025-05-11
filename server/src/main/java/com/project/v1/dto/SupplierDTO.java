package com.project.v1.dto;

import com.project.v1.entity.Employee;
import com.project.v1.entity.Supplierstatus;
import com.project.v1.entity.Supply;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SupplierDTO {
    private Integer id;
    private String name;
    private String address;
    private String tpoffice;
    private String email;
    private String contactperson;
    private String tpcontact;
    private String description;
    private LocalDate doregistered;
    private Supplierstatus supplierstatus;
    private Employee employee;
    private Set<Supply> supplies = new LinkedHashSet<>();
}
