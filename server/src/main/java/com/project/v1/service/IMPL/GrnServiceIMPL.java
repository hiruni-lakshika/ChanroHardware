package com.project.v1.service.IMPL;

import com.project.v1.dto.GrnDTO;
import com.project.v1.service.GrnService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;


@Service
@RequiredArgsConstructor
public class GrnServiceIMPL implements GrnService {
    @Override
    public List<GrnDTO> getAll(HashMap<String, String> params) {
        return List.of();
    }

    @Override
    public GrnDTO save(GrnDTO grnDTO) {
        return null;
    }

    @Override
    public GrnDTO update(GrnDTO grnDTO) {
        return null;
    }

    @Override
    public String delete(Integer id) {
        return "";
    }
}
