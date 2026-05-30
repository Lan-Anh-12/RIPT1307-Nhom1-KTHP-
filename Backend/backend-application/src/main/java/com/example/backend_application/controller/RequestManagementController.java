package com.example.backend_application.controller;

import com.example.backend_application.dto.BorrowCreateRequestDTO;
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

    // --- MỚI THÊM VÀO: API tìm kiếm lịch sử mượn theo từ khóa ---
    @GetMapping("/search-history")
    public ResponseEntity<List<ServiceRequestDTO>> searchHistory(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword
    ) {
        return ResponseEntity.ok(requestManagementService.searchHistory(keyword));
    }
    // --- KẾT THÚC PHẦN MỚI THÊM ---

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
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Cập nhật thất bại"));
    }

    /**
     * API Gửi yêu cầu mượn thiết bị mới
     */
    @PostMapping("/create")
    public ResponseEntity<?> createBorrowRequest(@RequestBody BorrowCreateRequestDTO requestDTO) {
        try {
            ServiceRequestDTO savedRequest = requestManagementService.createBorrowRequest(requestDTO);
            if (savedRequest != null) {
                return ResponseEntity.ok(savedRequest);
            }
            return ResponseEntity.badRequest().body(Map.of("message", "Không thể tạo yêu cầu, vui lòng kiểm tra lại thông tin."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }
}