package com.project.v1.repository;

import com.project.v1.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

    boolean existsByEmail(String email);
    boolean existsByTpoffice(String tpoffice);
}
