package com.project.v1.repository;

import com.project.v1.entity.Purchaseorder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderRepository extends JpaRepository<Purchaseorder, Integer> {
}
