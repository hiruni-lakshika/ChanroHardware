package com.project.v1.service.IMPL;

import com.project.v1.dto.SupplierDTO;
import com.project.v1.repository.PurchaseOrderRepository;
import com.project.v1.service.PurchaseOrderService;
import com.project.v1.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderIMPL implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<SupplierDTO> getAll(HashMap<String, String> params) {
        return List.of();
    }

    @Override
    public String delete(Integer id) {
        return "";
    }
}
