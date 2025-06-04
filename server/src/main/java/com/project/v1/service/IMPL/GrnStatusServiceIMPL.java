package com.project.v1.service.IMPL;

import com.project.v1.dto.GrnStatusDTO;
import com.project.v1.entity.Grnstatus;
import com.project.v1.exception.ResourceNotFoundException;
import com.project.v1.repository.GrnStatusRepository;
import com.project.v1.service.GrnStatusService;
import com.project.v1.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GrnStatusServiceIMPL implements GrnStatusService {

    private final GrnStatusRepository grnStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<GrnStatusDTO> getAll() {
        List<Grnstatus> grnStatusList = grnStatusRepository.findAll();
        if(!grnStatusList.isEmpty()){
            List<GrnStatusDTO> grnStatusDTOList = objectMapper.grnStatusToDtoList(grnStatusList);
            return grnStatusDTOList;
        }else{
            throw new ResourceNotFoundException("GrnStatus not found");
        }
    }
}
