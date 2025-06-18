package com.project.v1.controller;

import com.project.v1.dto.*;
import com.project.v1.util.regex.RegexProvider;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@CrossOrigin
@RequestMapping(value = "/regexes")
public class RegexController {

    @GetMapping(path = "/employee")
    public HashMap<String, HashMap<String,String>> employee(){
        return RegexProvider.get(new EmployeeDTO());
    }

    @GetMapping(path = "/user")
    public HashMap<String, HashMap<String,String>> user(){
        return RegexProvider.get(new UserDTO());
    }

    @GetMapping(path = "/supplier")
    public HashMap<String, HashMap<String,String>> supplier(){
        return RegexProvider.get(new SupplierDTO());
    }

    @GetMapping(path = "/po")
    public HashMap<String, HashMap<String,String>> po(){
        return RegexProvider.get(new PurchaseOrderDTO());
    }

    @GetMapping(path = "/grn")
    public HashMap<String, HashMap<String,String>> grn(){
        return RegexProvider.get(new GrnDTO());
    }
}
