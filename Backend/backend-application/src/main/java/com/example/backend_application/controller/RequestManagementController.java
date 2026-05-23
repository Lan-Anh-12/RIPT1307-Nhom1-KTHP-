package com.example.backend_application.controller;

import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.service.RequestManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*") 
public class RequestManagementController {

    @Autowired
    private RequestManagementService requestManagementService;

    /**
     * API Tìm kiếm và phân trang yêu cầu mượn thiết bị
     * Endpoint: GET /api/requests/search?keyword=...&page=0&size=10
     * * @param keyword Từ khóa tìm kiếm (Mã yêu cầu, mã sinh viên, tên sinh viên)
     * @param page    Số trang hiện tại (mặc định bắt đầu từ trang 0)
     * @param size    Số lượng bản ghi trên một trang (mặc định là 10)
     * @return        Page chứa danh sách ServiceRequestDTO kèm thông tin phân trang
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ServiceRequestDTO>> searchRequests(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        

        Page<ServiceRequestDTO> resultPage = requestManagementService.searchRequests(keyword, pageable);
        
        return ResponseEntity.ok(resultPage);
    }
}
