package com.project.v1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "grnitem")
public class Grnitem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "unitprice", precision = 8, scale = 2)
    private BigDecimal unitprice;

    @Column(name = "quantity")
    private Integer quantity;

    @Size(max = 45)
    @Column(name = "linetotal", length = 45)
    private String linetotal;

    @JsonIgnore
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "grn_id", nullable = false)
    private Grn grn;

}