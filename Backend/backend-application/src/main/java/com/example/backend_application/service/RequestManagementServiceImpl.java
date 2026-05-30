package com.example.backend_application.service;


import com.example.backend_application.dto.BorrowCreateRequestDTO;
import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.entity.BorrowRequest;
import com.example.backend_application.repository.BorrowRequestRepository;
import com.example.backend_application.repository.BorrowRequestEntityRepository;
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


    @Autowired
    private BorrowRequestEntityRepository borrowRequestEntityRepository;


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


    @Override
    @Transactional
    public ServiceRequestDTO updateRequestStatus(Long id, String status) {
        Optional<BorrowRequestView> requestOpt = borrowRequestRepository.findByIdRequest(id);
        if (requestOpt.isEmpty()) return null;


        int updatedRows = borrowRequestRepository.updateRequestDetails(id, status);
       
        if (updatedRows > 0) {
            System.out.println("Đã cập nhật ID " + id + " sang trạng thái " + status);
            return getRequestById(id);
        }
        return null;
    }


    @Override
    @Transactional
    public ServiceRequestDTO createBorrowRequest(BorrowCreateRequestDTO requestDTO) {
        // 1. Tạo mới Entity từ DTO
        BorrowRequest entity = new BorrowRequest();
       
        // SỬA LỖI: Dùng setRequestDate khớp với thuộc tính requestDate trong BorrowRequest
        entity.setRequestDate(requestDTO.getRequestDate());
        entity.setExpectedReturnDate(requestDTO.getExpectedReturnDate());
        entity.setQuantity(requestDTO.getQuantity());
        entity.setStatus("PENDING");
       
        // Gán deviceItemId từ DTO sang Entity
        entity.setDeviceItemId(requestDTO.getDeviceItemId());


        // 2. Lưu vào database thông qua Repository cho Entity
        BorrowRequest savedEntity = borrowRequestEntityRepository.save(entity);
       
        // 3. Trả về thông tin yêu cầu dưới dạng DTO
        return getRequestById(savedEntity.getId());
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
