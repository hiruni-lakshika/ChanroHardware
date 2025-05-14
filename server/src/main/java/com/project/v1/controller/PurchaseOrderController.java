package com.project.v1.controller;

import com.project.v1.dto.PurchaseOrderDTO;
import com.project.v1.dto.StandardResponse;
import com.project.v1.dto.SupplierDTO;
import com.project.v1.service.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/purchaseorders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    public List<PurchaseOrderDTO> getAll(@RequestParam HashMap<String,String> params){
        return purchaseOrderService.getAll(params);
    }

    @PostMapping
    public PurchaseOrderDTO getById(@RequestBody PurchaseOrderDTO purchaseOrderDTO){
        return purchaseOrderService.save(purchaseOrderDTO);
    }

    @PutMapping
    public PurchaseOrderDTO update(@RequestBody PurchaseOrderDTO purchaseOrderDTO){
        return purchaseOrderService.update(purchaseOrderDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        String message = purchaseOrderService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message), HttpStatus.OK
        );
    }
}
