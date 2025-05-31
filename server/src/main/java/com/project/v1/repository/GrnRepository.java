package com.project.v1.repository;

import com.project.v1.entity.Grn;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrnRepository extends JpaRepository<Grn, Integer> {

    boolean existsByEmail(String email);
    boolean existsByNic(String nic);
    boolean existsByNumber(String number);
}
