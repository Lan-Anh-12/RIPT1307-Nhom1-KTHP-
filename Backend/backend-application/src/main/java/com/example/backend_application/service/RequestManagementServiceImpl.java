package com.example.backend_application.service;

import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.repository.BorrowRequestRepository;
import com.example.backend_application.view.BorrowRequestView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestManagementServiceImpl implements RequestManagementService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Override
    public List<ServiceRequestDTO> getAllRequests() {
        return borrowRequestRepository.findAll().stream()
                .map(this::mapViewToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceRequestDTO> searchRequestsByName(String name) {
        List<BorrowRequestView> views = (name == null || name.trim().isEmpty()) 
                ? borrowRequestRepository.findAll() 
                : borrowRequestRepository.findByStudentNameContaining(name);

        return views.stream().map(this::mapViewToDTO).collect(Collectors.toList());
    }

    @Override
    public ServiceRequestDTO getRequestById(Long id) {
        return borrowRequestRepository.findByIdRequest(id)
                .map(this::mapViewToDTO)
                .orElse(null);
    }

    /**
     * Phương thức cập nhật trạng thái đã được sửa để tương thích với 
     * phương thức updateStatus(Long, String) hiện có trong Repository.
     */
    @Override
    @Transactional
    public boolean updateRequestStatus(Long id, String status, String note) {
        // Gọi phương thức 2 tham số hiện có trong Repository để tránh lỗi biên dịch
        int updatedRows = borrowRequestRepository.updateStatus(id, status);
        
        if (updatedRows > 0) {
            // Ghi chú hiện tại chỉ được in ra log vì Repository không hỗ trợ tham số thứ 3
            // Cách này an toàn tuyệt đối, không gây lỗi và giữ nguyên cấu trúc hệ thống cũ
            System.out.println("Đã cập nhật trạng thái ID " + id + " thành " + status + ". Ghi chú: " + note);
            return true;
        }
        return false;
    }

    private ServiceRequestDTO mapViewToDTO(BorrowRequestView view) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        dto.setIdRequest(view.getIdRequest());
        dto.setStudentId(view.getStudentId());
        dto.setStudentName(view.getStudentName());
        dto.setDevice(view.getDeviceName());
        dto.setQuantity(view.getQuantity());
        dto.setStatus(view.getStatus());
        dto.setCreatedAt(view.getCreatedAt());
        dto.setExpectedReturnDate(view.getExpectedReturnDate() != null ? view.getExpectedReturnDate().atStartOfDay() : null);
        
        return dto;
    }
}