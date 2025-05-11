package com.project.v1.controller;

import com.project.v1.dto.StandardResponse;
import com.project.v1.dto.SupplierDTO;
import com.project.v1.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public List<SupplierDTO> getAll(@RequestParam HashMap<String,String> params){
        return supplierService.getAll(params);
    }

    @PostMapping
    public SupplierDTO getById(@RequestBody SupplierDTO supplierDTO){
        return supplierService.save(supplierDTO);
    }

    @PutMapping
    public SupplierDTO update(@RequestBody SupplierDTO supplierDTO){
        return supplierService.update(supplierDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        String message = supplierService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message), HttpStatus.OK
        );
    }
}
