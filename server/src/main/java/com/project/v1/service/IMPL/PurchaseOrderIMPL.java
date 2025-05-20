package com.project.v1.service.IMPL;

import com.project.v1.dto.PurchaseOrderDTO;
import com.project.v1.entity.Poitem;
import com.project.v1.entity.Purchaseorder;
import com.project.v1.exception.ResourceAlreadyExistException;
import com.project.v1.exception.ResourceNotFoundException;
import com.project.v1.repository.PurchaseOrderRepository;
import com.project.v1.service.PurchaseOrderService;
import com.project.v1.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PurchaseOrderIMPL implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ObjectMapper objectMapper;


    @Override
    public List<PurchaseOrderDTO> getAll(HashMap<String, String> params) {

        List<Purchaseorder> purchaseOrders = purchaseOrderRepository.findAll();
        if(!purchaseOrders.isEmpty()){
            List<PurchaseOrderDTO> dtos = objectMapper.poListToDtoList(purchaseOrders);
            if(params.isEmpty()){
                return dtos;
            }else{
                String number = params.get("number");
                String employeeid = params.get("employeeid");
                String postatusid = params.get("postatusid");

                Stream<PurchaseOrderDTO> stream = dtos.stream();

                if (number != null ) stream = stream.filter( p -> p.getNumber().equals(number) );
                if(employeeid !=null ) stream = stream.filter(p -> p.getEmployee().getId() == Integer.parseInt(employeeid));
                if(postatusid !=null ) stream = stream.filter(p -> p.getPostatus().getId() == Integer.parseInt(postatusid));

                return stream.collect(java.util.stream.Collectors.toList());

            }
        }else{
            throw new ResourceNotFoundException("Purchase Order Not Found!");
        }

    }

    @Override
    public PurchaseOrderDTO save(PurchaseOrderDTO purchaseOrderDTO) {

        if (purchaseOrderRepository.existsByNumber(purchaseOrderDTO.getNumber())) {
            throw new ResourceNotFoundException("Number Already Exists");
        }

        Purchaseorder po = objectMapper.purchaseOrderDtoToPo(purchaseOrderDTO);

        for(Poitem i : po.getPoitems()){
            i.setPurchaseorder(po);
        }

        purchaseOrderRepository.save(po);
        return purchaseOrderDTO;
    }

    @Override
    public PurchaseOrderDTO update(PurchaseOrderDTO purchaseOrderDTO) {

        Purchaseorder porec = purchaseOrderRepository.findById(purchaseOrderDTO.getId()).orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));

        if (!porec.getNumber().equals(purchaseOrderDTO.getNumber()) && purchaseOrderRepository.existsByNumber(purchaseOrderDTO.getNumber())) {
            throw new ResourceAlreadyExistException("Number Already Exists");
        }


        try {
            Purchaseorder po = objectMapper.purchaseOrderDtoToPo(purchaseOrderDTO);
            po.getPoitems().forEach(sup -> sup.setPurchaseorder(po));
            purchaseOrderRepository.save(po);

        } catch (Exception e) {
            System.out.println(e);
        }

        return purchaseOrderDTO;
    }

    @Override
    public String delete(Integer id) {
        Purchaseorder purchaseOrder = purchaseOrderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found!"));
        purchaseOrderRepository.delete(purchaseOrder);
        return "Purchase Order Successfully Deleted!";
    }
}
