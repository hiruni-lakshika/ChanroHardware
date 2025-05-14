package com.project.v1.service;

import com.project.v1.dto.PurchaseOrderDTO;

import java.util.HashMap;
import java.util.List;

public interface PurchaseOrderService {

    List<PurchaseOrderDTO> getAll(HashMap<String, String> params);

    PurchaseOrderDTO save(PurchaseOrderDTO purchaseOrderDTO);

    PurchaseOrderDTO update(PurchaseOrderDTO purchaseOrderDTO);

    String delete(Integer id);
}
