package com.project.v1.controller;

import com.project.v1.dto.POStatusDTO;
import com.project.v1.service.POStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/postatuses")
@RequiredArgsConstructor
public class POStatusController {

    private final POStatusService poStatusService;

    @GetMapping
    public List<POStatusDTO> getAll(){
        return poStatusService.getAll();
    }
}
