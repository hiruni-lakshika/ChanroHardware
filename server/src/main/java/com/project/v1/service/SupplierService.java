package com.project.v1.service;

import com.project.v1.dto.SupplierDTO;

import java.util.HashMap;
import java.util.List;

public interface SupplierService {
    List<SupplierDTO> getAll(HashMap<String, String> params);

    SupplierDTO save(SupplierDTO supplierDTO);

    SupplierDTO update(SupplierDTO supplierDTO);

    String delete(Integer id);
}
