package com.example.backend_application.service;

import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.entity.BorrowRequest;
import com.example.backend_application.repository.BorrowRequestRepository;
import com.example.backend_application.repository.InventoryRepository;
import com.example.backend_application.view.BorrowRequestView;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class RequestManagementServiceImpl implements RequestManagementService {

    @PersistenceContext
    private EntityManager em;
    
    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

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
        Optional<BorrowRequestView> requestOpt = borrowRequestRepository.findByIdRequest(id);
        if (requestOpt.isEmpty()) return null;
        
        BorrowRequestView request = requestOpt.get();

        if ("APPROVED".equals(status)) {
            // Kiểm tra tồn kho trước khi cho mượn
            Integer available = inventoryRepository.getAvailableQuantity(request.getDeviceId());
            if (available == null || available < request.getQuantity()) {
                status = "REJECTED"; 
            } else {
                inventoryRepository.decreaseQuantity(request.getDeviceId(), request.getQuantity());
            }
        } 
        else if ("RETURNED".equals(status)) {
            // Cộng tồn kho lại
            inventoryRepository.increaseQuantity(request.getDeviceId(), request.getQuantity());
        }

        // Cập nhật vào DB
        borrowRequestRepository.updateRequestDetails(id, status);
        
        return getRequestById(id);
    }

    private ServiceRequestDTO mapViewToDTO(BorrowRequestView view) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        dto.setIdRequest(view.getIdRequest());
        dto.setStudentId(view.getStudentId());
        dto.setStudentName(view.getStudentName());
        dto.setDevice(view.getDeviceName());
        dto.setQuantity(view.getQuantity());
        dto.setStatus(view.getStatus());
        dto.setRequestDate(view.getBorrowDate());
        dto.setExpectedReturnDate(view.getExpectedReturnDate() );
        dto.setActualReturnDate(view.getActualReturnDate());
        return dto;
    }
}