package com.project.v1.service;

import com.project.v1.dto.SupplierDTO;

import java.util.HashMap;
import java.util.List;

public interface PurchaseOrderService {
    List<SupplierDTO> getAll(HashMap<String, String> params);

    String delete(Integer id);
}
