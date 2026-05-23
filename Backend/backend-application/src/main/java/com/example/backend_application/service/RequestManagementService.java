package com.example.backend_application.service;

import com.example.backend_application.dto.ServiceRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RequestManagementService {
    Page<ServiceRequestDTO> searchRequests(String keyword, Pageable pageable);
}