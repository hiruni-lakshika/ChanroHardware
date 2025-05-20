package com.project.v1.service.IMPL;

import com.project.v1.dto.POStatusDTO;
import com.project.v1.entity.Postatus;
import com.project.v1.exception.ResourceNotFoundException;
import com.project.v1.repository.POStatusRepository;
import com.project.v1.service.POStatusService;
import com.project.v1.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class POStatusServiceIMPL implements POStatusService {

    private final POStatusRepository poStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<POStatusDTO> getAll() {
        List<Postatus> list = poStatusRepository.findAll();
        if(!list.isEmpty()){
            return objectMapper.poStatusListToDtoList(list);
        }else{
            throw new ResourceNotFoundException("PO Status Not Found!");
        }
    }
}
