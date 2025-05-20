package com.project.v1.service.IMPL;

import com.project.v1.dto.ItemDTO;
import com.project.v1.entity.Item;
import com.project.v1.exception.ResourceNotFoundException;
import com.project.v1.repository.ItemRepository;
import com.project.v1.service.ItemService;
import com.project.v1.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemServiceIMPL implements ItemService {

    private final ItemRepository itemRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ItemDTO> getAll() {
        List<Item> items = itemRepository.findAll();
        if(!items.isEmpty()){
            return objectMapper.itemsListToDtoList(items);
        }else{
            throw new ResourceNotFoundException("Items Not Found!");
        }
    }
}
