package com.project.v1.report.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CountByDesignation {
    @Id
    private Integer id;
    private String designation;
    private Long count;

    public CountByDesignation(String designation, Long count) {
        this.designation = designation;
        this.count = count;
    }
}
