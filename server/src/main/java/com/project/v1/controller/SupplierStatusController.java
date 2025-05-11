package com.project.v1.controller;

import com.project.v1.dto.SupplierStatusDTO;
import com.project.v1.service.SupplierStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/supplierstatuses")
@RequiredArgsConstructor
public class SupplierStatusController {

    private final SupplierStatusService supplierStatusService;

    @GetMapping
    public List<SupplierStatusDTO> getAll(){
        return supplierStatusService.getAll();
    }
}
