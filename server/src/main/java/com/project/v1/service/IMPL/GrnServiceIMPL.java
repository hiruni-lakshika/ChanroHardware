package com.project.v1.service.IMPL;

import com.project.v1.dto.GrnDTO;
import com.project.v1.entity.Grn;
import com.project.v1.entity.Grnitem;
import com.project.v1.exception.ResourceAlreadyExistException;
import com.project.v1.exception.ResourceNotFoundException;
import com.project.v1.repository.GrnRepository;
import com.project.v1.service.GrnService;
import com.project.v1.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;


@Service
@RequiredArgsConstructor
public class GrnServiceIMPL implements GrnService {

    private final GrnRepository grnRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<GrnDTO> getAll(HashMap<String, String> params) {

        List<Grn> grns = grnRepository.findAll();
        if(!grns.isEmpty()){
            List<GrnDTO> grnDTOS = objectMapper.grnListToDtoList(grns);
            if(params.isEmpty()){
                return grnDTOS;
            }else{
                throw null;
            }
        }else{
            throw new ResourceNotFoundException("Grn not found");
        }
    }

    @Override
    public GrnDTO save(GrnDTO grnDTO) {

        Grn grn = objectMapper.GrnDtotoGrn(grnDTO);

        if (grnRepository.existsByCode(grnDTO.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }

        for(Grnitem i : grn.getGrnitems()){
            i.setGrn(grn);
        }

        grnRepository.save(grn);
        return grnDTO;
    }

    @Override
    public GrnDTO update(GrnDTO grnDTO) {

        Grn grnrec = grnRepository.findById(grnDTO.getId()).orElseThrow(() -> new ResourceNotFoundException("GRN Not Found"));

        if (!grnrec.getCode().equals(grnDTO.getCode()) && grnRepository.existsByCode(grnDTO.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exists");
        }


        try {
            Grn grn = objectMapper.grnDtoToGrn(grnDTO);
            grn.getGrnitems().forEach(sup -> sup.setGrn(grn));
            grnRepository.save(grn);

        } catch (Exception e) {
            System.out.println(e);
        }

        return grnDTO;
    }

    @Override
    public String delete(Integer id) {
        Grn grnrec = grnRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("GRN Not Found"));
        grnRepository.delete(grnrec);
        return "Grn Deleted Successfully";
    }
}
