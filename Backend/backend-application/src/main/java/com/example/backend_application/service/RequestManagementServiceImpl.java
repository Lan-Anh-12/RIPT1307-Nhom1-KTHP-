package com.example.backend_application.service;

import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.repository.BorrowRequestRepository;
import com.example.backend_application.view.BorrowRequestView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestManagementServiceImpl implements RequestManagementService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Override
    public List<ServiceRequestDTO> searchRequestsByName(String name) {
        // Tìm theo tên thông qua ViewRepository
        List<BorrowRequestView> views = (name == null || name.trim().isEmpty()) 
                                        ? borrowRequestRepository.findAll() 
                                        : borrowRequestRepository.findByStudentNameContaining(name);

        return views.stream()
                    .map(this::mapViewToDTO)
                    .collect(Collectors.toList());
    }

    @Override
    public List<ServiceRequestDTO> getAllRequests() {
        return borrowRequestRepository.findAll()
                                      .stream()
                                      .map(this::mapViewToDTO)
                                      .collect(Collectors.toList());
    }

    private ServiceRequestDTO mapViewToDTO(BorrowRequestView view) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        
        dto.setIdRequest(view.getIdRequest());
        dto.setStudentId(view.getStudentId());
        dto.setStudentName(view.getStudentName());
        dto.setEmail(view.getEmail());
        dto.setDevice(view.getDeviceName());
        dto.setQuantity(view.getQuantity());
        dto.setStatus(view.getStatus());
        dto.setCreatedAt(view.getCreatedAt());
        dto.setExpectedReturnDate(view.getExpectedReturnDate() != null ? view.getExpectedReturnDate().atStartOfDay() : null);
        dto.setActualReturnDate(view.getActualReturnDate() != null ? view.getActualReturnDate().atStartOfDay() : null);
        dto.setTotalRequest(view.getTotalRequest());
        
        return dto;
    }
}