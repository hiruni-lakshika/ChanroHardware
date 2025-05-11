package com.project.v1.service.IMPL;

import com.project.v1.dto.SupplierDTO;
import com.project.v1.entity.Employee;
import com.project.v1.entity.Supplier;
import com.project.v1.exception.ResourceAlreadyExistException;
import com.project.v1.exception.ResourceNotFoundException;
import com.project.v1.repository.SupplierRepository;
import com.project.v1.service.SupplierService;
import com.project.v1.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@RequiredArgsConstructor
public class SupplierServiceIMPL implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<SupplierDTO> getAll(HashMap<String, String> params) {
        List<Supplier> suppliers = supplierRepository.findAll();
        if (!suppliers.isEmpty()) {
            List<SupplierDTO> dtos = objectMapper.supplierListToDtoList(suppliers);
            if (params.isEmpty()) {
                return dtos;
            } else {

                String name = params.get("name");
                String email = params.get("email");
                String employeeid = params.get("employeeid");

                Stream<SupplierDTO> stream = dtos.stream();

                if (name != null) stream = stream.filter(s -> s.getName().contains(name));
                if (email != null) stream = stream.filter(s -> s.getEmail().equals(email));
                if (employeeid != null)
                    stream = stream.filter(s -> s.getEmployee().getId() == Integer.parseInt(employeeid));

                return stream.collect(Collectors.toList());
            }
        } else {
            throw new ResourceNotFoundException("Supplier not found");
        }
    }

    @Override
    public SupplierDTO save(SupplierDTO supplierDTO) {

        if (supplierRepository.existsByEmail(supplierDTO.getEmail())) {
            throw new ResourceNotFoundException("Supplier Email Already Exists");
        }

        if (supplierRepository.existsByTpoffice(supplierDTO.getTpoffice())) {
            throw new ResourceNotFoundException("Supplier Number Already Exists");
        }

        Supplier supplier = objectMapper.supplierDtoToSupplier(supplierDTO);
        supplierRepository.save(supplier);
        return supplierDTO;
    }

    @Override
    public SupplierDTO update(SupplierDTO supplierDTO) {

        Supplier supprec = supplierRepository.findById(supplierDTO.getId()).orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found"));

        if (!supprec.getEmail().equals(supplierDTO.getEmail()) && supplierRepository.existsByEmail(supplierDTO.getEmail())) {
            throw new ResourceAlreadyExistException("Email Already Exists");
        }

        if (!supprec.getTpoffice().equals(supplierDTO.getTpoffice()) && supplierRepository.existsByTpoffice(supplierDTO.getTpoffice())) {
            throw new ResourceAlreadyExistException("Telephone Number Already Exists");
        }

        Supplier supplier = objectMapper.supplierDtoToSupplier(supplierDTO);
        supplierRepository.save(supplier);
        return supplierDTO;
    }


    @Override
    public String delete(Integer id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found"));
        supplierRepository.delete(supplier);
        return "Successfully Deleted";
    }
}
