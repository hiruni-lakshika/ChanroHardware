package com.project.v1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "purchaseorder")
public class Purchaseorder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "number", length = 45)
    private String number;

    @Column(name = "doexpected")
    private LocalDate doexpected;

    @Column(name = "expectedtotal", precision = 12, scale = 2)
    private BigDecimal expectedtotal;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "date")
    private LocalDate date;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "postatus_id", nullable = false)
    private Postatus postatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "supplier_idsupplier", nullable = false)
    private Supplier supplierIdsupplier;

    @JsonIgnore
    @OneToMany(mappedBy = "purchaseorder")
    private Set<Poitem> poitems = new LinkedHashSet<>();

}