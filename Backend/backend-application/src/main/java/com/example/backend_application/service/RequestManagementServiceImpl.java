package com.example.backend_application.service;

import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.entity.BorrowRequest;
import com.example.backend_application.repository.BorrowRequestRepository;
import com.example.backend_application.view.BorrowRequestView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

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
    public ServiceRequestDTO updateRequestStatus(Long id, String status) {
        // 1. Kiểm tra trạng thái hợp lệ
        // Chỉ cho phép update nếu request tồn tại
        Optional<BorrowRequestView> requestOpt = borrowRequestRepository.findByIdRequest(id);
        if (requestOpt.isEmpty()) return null;

        // 2. Thực hiện cập nhật
        // Nếu status là RETURNED, hệ thống sẽ tự động set ngày hiện tại vào actualReturnDate qua câu query ở trên
        int updatedRows = borrowRequestRepository.updateRequestDetails(id, status);
        
        if (updatedRows > 0) {
            System.out.println("Đã cập nhật ID " + id + " sang trạng thái " + status);
            return getRequestById(id);
        }
        return null;
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
        dto.setExpectedReturnDate(view.getExpectedReturnDate() );
        dto.setActualReturnDate(view.getActualReturnDate());
        return dto;
    }
}