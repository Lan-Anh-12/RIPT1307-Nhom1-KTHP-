package com.example.backend_application.service;

import com.example.backend_application.dto.BorrowCreateRequestDTO;
import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.entity.BorrowRequest;
import com.example.backend_application.entity.User;
import com.example.backend_application.repository.BorrowRequestRepository;
import com.example.backend_application.repository.InventoryRepository;
import com.example.backend_application.view.BorrowRequestView;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private NotificationService notificationService;

    @Override
    public List<ServiceRequestDTO> getAllRequests() {
        return borrowRequestRepository.findAllViews().stream()
                .map(this::mapViewToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceRequestDTO> searchRequestsByName(String name) {
        List<BorrowRequestView> views = (name == null || name.trim().isEmpty())
                ? borrowRequestRepository.findAllViews()
                : borrowRequestRepository.findByStudentNameContaining(name);
        return views.stream().map(this::mapViewToDTO).collect(Collectors.toList());
    }

    @Override
    public List<ServiceRequestDTO> searchHistory(String keyword) {
        List<ServiceRequestDTO> allRequests = getAllRequests();
        if (keyword == null || keyword.trim().isEmpty()) return allRequests;
        String lowerKeyword = keyword.toLowerCase();
        return allRequests.stream()
            .filter(dto -> {
                String requestCode = "req-2025-" + String.format("%03d", dto.getIdRequest());
                return dto.getDevice().toLowerCase().contains(lowerKeyword) || requestCode.contains(lowerKeyword);
            })
            .collect(Collectors.toList());
    }

    @Override
    public ServiceRequestDTO getRequestById(Long id) {
        return borrowRequestRepository.findByIdRequest(id)
                .map(this::mapViewToDTO)
                .orElse(null);
    }

    @Override
    @Transactional
    public ServiceRequestDTO updateRequestStatus(Long id, String status) {
        Optional<BorrowRequestView> requestOpt = borrowRequestRepository.findByIdRequest(id);
        if (requestOpt.isEmpty()) return null;
        
        BorrowRequestView view = requestOpt.get();

        if ("APPROVED".equals(status)) {
            Integer available = inventoryRepository.getAvailableQuantity(view.getDeviceId());
            if (available == null || available < view.getQuantity()) {
                status = "REJECTED"; 
            } else {
                inventoryRepository.decreaseQuantity(view.getDeviceId(), view.getQuantity());
            }
        } else if ("RETURNED".equals(status)) {
            inventoryRepository.increaseQuantity(view.getDeviceId(), view.getQuantity());
        }

        borrowRequestRepository.updateRequestDetails(id, status);
        em.flush();
        em.clear();
        
        BorrowRequest entity = borrowRequestRepository.findById(id).orElse(null);
        if (entity != null) {
            // SỬA: Truyền entity.getDeviceItemId() (kiểu Long) để lấy tên thiết bị
            notificationService.createManualNotification(entity.getAppUser(), entity.getDeviceItemId(), status);
        }
        
        return getRequestById(id);
    }

    @Override
    @Transactional
    public boolean createBorrowRequest(BorrowCreateRequestDTO requestDTO) {
        try {
            User user = em.find(User.class, requestDTO.getId());
            if (user == null) return false;

            BorrowRequest entity = new BorrowRequest();
            entity.setRequestDate(requestDTO.getRequestDate());
            entity.setExpectedReturnDate(requestDTO.getExpectedReturnDate());
            entity.setQuantity(requestDTO.getQuantity());
            entity.setStatus("PENDING");
            entity.setDeviceItemId(requestDTO.getDeviceItemId());
            entity.setAppUser(user); 

            borrowRequestRepository.save(entity);

            // SỬA: Truyền entity.getDeviceItemId() (kiểu Long)
            notificationService.createManualNotification(user, entity.getDeviceItemId(), "PENDING");
            
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
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
        dto.setExpectedReturnDate(view.getExpectedReturnDate());
        dto.setActualReturnDate(view.getActualReturnDate());
        return dto;
    }
}