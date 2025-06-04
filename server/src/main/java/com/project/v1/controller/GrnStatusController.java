package com.project.v1.controller;


import com.project.v1.dto.GrnStatusDTO;
import com.project.v1.service.GrnStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/grnstatuses")
@RequiredArgsConstructor
public class GrnStatusController {

    private final GrnStatusService grnStatusService;

    @GetMapping
    public List<GrnStatusDTO> getAll(){
        return grnStatusService.getAll();
    }
}
