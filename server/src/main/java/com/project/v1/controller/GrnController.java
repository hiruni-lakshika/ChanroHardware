package com.project.v1.controller;

import com.project.v1.dto.GrnDTO;
import com.project.v1.dto.StandardResponse;
import com.project.v1.service.GrnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/grns")
@RequiredArgsConstructor
public class GrnController {

    private final GrnService grnService;

    @GetMapping
    public List<GrnDTO> getAll(@RequestParam HashMap<String,String> params){
        return grnService.getAll(params);
    }

    @PostMapping
    public GrnDTO getById(@RequestBody GrnDTO grnDTO){
        return grnService.save(grnDTO);
    }

    @PutMapping
    public GrnDTO update(@RequestBody GrnDTO grnDTO){
        return grnService.update(grnDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        String message = grnService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message), HttpStatus.OK
        );
    }
}
