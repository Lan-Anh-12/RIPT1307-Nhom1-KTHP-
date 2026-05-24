package com.example.backend_application.service;

import com.example.backend_application.dto.ServiceRequestDTO;

import java.util.List;

public interface RequestManagementService {
   // Tìm kiếm yêu cầu mượn thiết bị theo tên sinh viên (tên nằm trong bảng app_user)
    List<ServiceRequestDTO> searchRequestsByName(String name);

    // Lấy tất cả yêu cầu mượn thiết bị (dùng trong Service)
    List<ServiceRequestDTO> getAllRequests();
}