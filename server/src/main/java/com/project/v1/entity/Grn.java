package com.project.v1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "grn")
public class Grn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "doreceived")
    private LocalDate doreceived;

    @Column(name = "grandtotal", precision = 20, scale = 5)
    private BigDecimal grandtotal;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "purchaseorder_id", nullable = false)
    private Purchaseorder purchaseorder;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "grnstatus_id", nullable = false)
    private Grnstatus grnstatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "supplier_idsupplier", nullable = false)
    private Supplier supplierIdsupplier;

    @JsonIgnore
    @OneToMany(mappedBy = "grn")
    private Set<Grnitem> grnitems = new LinkedHashSet<>();

}