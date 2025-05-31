package com.project.v1.service;

import com.project.v1.dto.GrnDTO;

import java.util.HashMap;
import java.util.List;

public interface GrnService {
    List<GrnDTO> getAll(HashMap<String, String> params);

    GrnDTO save(GrnDTO grnDTO);

    GrnDTO update(GrnDTO grnDTO);

    String delete(Integer id);
}
