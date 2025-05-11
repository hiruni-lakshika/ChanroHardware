package com.project.v1.service.IMPL;

import com.project.v1.dto.SupplierStatusDTO;
import com.project.v1.entity.Supplierstatus;
import com.project.v1.exception.ResourceNotFoundException;
import com.project.v1.repository.SupplierStatusRepository;
import com.project.v1.service.SupplierStatusService;
import com.project.v1.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierStatusServiceIMPL implements SupplierStatusService {

    private final ObjectMapper objectMapper;
    private final SupplierStatusRepository supplierStatusRepository;

    @Override
    public List<SupplierStatusDTO> getAll() {
        List<Supplierstatus> list = supplierStatusRepository.findAll();
        if(!list.isEmpty()){
            return objectMapper.supplierStatusListToDtoList(list);
        }else{
            throw new ResourceNotFoundException("Supplier Status Not Found!");
        }
    }
}
