package com.project.v1.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "supplier")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idsupplier", nullable = false)
    private Integer id;

    @Size(max = 100)
    @Column(name = "name", length = 100)
    private String name;

    @Lob
    @Column(name = "address")
    private String address;

    @Size(max = 10)
    @Column(name = "tpoffice", length = 10)
    private String tpoffice;

    @Size(max = 100)
    @Column(name = "email", length = 100)
    private String email;

    @Size(max = 45)
    @Column(name = "contactperson", length = 45)
    private String contactperson;

    @Size(max = 45)
    @Column(name = "tpcontact", length = 45)
    private String tpcontact;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "doregistered")
    private LocalDate doregistered;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "supplierstatus_id", nullable = false)
    private Supplierstatus supplierstatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @OneToMany(mappedBy = "supplierIdsupplier")
    private Set<Supply> supplies = new LinkedHashSet<>();

}