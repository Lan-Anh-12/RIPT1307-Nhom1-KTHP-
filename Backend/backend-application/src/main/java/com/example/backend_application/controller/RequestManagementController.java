package com.example.backend_application.controller;

import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.service.RequestManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*") 
public class RequestManagementController {

    @Autowired
    private RequestManagementService requestManagementService;

    // Lấy tất cả yêu cầu
    @GetMapping("/all")
    public ResponseEntity<List<ServiceRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(requestManagementService.getAllRequests());
    }

    // Tìm kiếm yêu cầu theo tên sinh viên
    @GetMapping("/search")
    public ResponseEntity<List<ServiceRequestDTO>> searchRequests(
            @RequestParam(value = "name", required = false, defaultValue = "") String name
    ) {
        return ResponseEntity.ok(requestManagementService.searchRequestsByName(name));
    }

    // Lấy chi tiết 1 yêu cầu (Dùng cho cả Popup Duyệt và Popup Ghi nhận trả)
    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestDTO> getRequestById(@PathVariable("id") Long id) {
        ServiceRequestDTO requestDTO = requestManagementService.getRequestById(id);
        return (requestDTO != null) ? ResponseEntity.ok(requestDTO) : ResponseEntity.notFound().build();
    }

    // API Xử lý nghiệp vụ: Chuyển trạng thái (PENDING -> APPROVED/REJECTED) 
    // và (APPROVED -> RETURNED)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable("id") Long id, @RequestBody Map<String, String> requestBody) {
        String status = requestBody.get("status");
        ServiceRequestDTO updated = requestManagementService.updateRequestStatus(id, status);
        
        if (updated != null) {
            return ResponseEntity.ok(updated); // Trả về DTO (đối tượng JSON hợp lệ)
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Cập nhật thất bại"));
    }
}