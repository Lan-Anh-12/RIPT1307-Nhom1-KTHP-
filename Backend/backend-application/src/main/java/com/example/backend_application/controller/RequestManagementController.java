package com.example.backend_application.controller;

import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.service.RequestManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*") 
public class RequestManagementController {

    @Autowired
    private RequestManagementService requestManagementService;

    @GetMapping("/all")
    public ResponseEntity<List<ServiceRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(requestManagementService.getAllRequests());
    }

    // api tìm kiếm yêu cầu mượn thiết bị theo tên sinh viên (GET)
    @GetMapping("/search")
    public ResponseEntity<List<ServiceRequestDTO>> searchRequests(
            @RequestParam(value = "name", required = false, defaultValue = "") String name
    ) {
        // Gọi service trả về List thô
        List<ServiceRequestDTO> results = requestManagementService.searchRequestsByName(name);
        
        return ResponseEntity.ok(results);
    }
}