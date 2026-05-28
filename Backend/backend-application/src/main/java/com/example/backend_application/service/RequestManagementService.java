package com.example.backend_application.service;

import com.example.backend_application.dto.ServiceRequestDTO;
import java.util.List;

public interface RequestManagementService {
    
    // Lấy danh sách toàn bộ yêu cầu để hiển thị trên bảng quản lý
    List<ServiceRequestDTO> getAllRequests();

    // Tìm kiếm yêu cầu theo tên sinh viên
    List<ServiceRequestDTO> searchRequestsByName(String name);

    // Lấy chi tiết một yêu cầu cụ thể để đổ dữ liệu lên Popup
    ServiceRequestDTO getRequestById(Long id);

    /**
     * Cập nhật trạng thái và lưu ghi chú xử lý.
     * Hỗ trợ logic chuyển tiếp trạng thái:
     * - PENDING -> APPROVED / REJECTED
     * - APPROVED -> RETURNED
     */
    ServiceRequestDTO updateRequestStatus(Long id, String status);
}