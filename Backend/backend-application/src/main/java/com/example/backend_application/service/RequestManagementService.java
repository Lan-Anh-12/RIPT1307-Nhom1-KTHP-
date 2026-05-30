package com.example.backend_application.service;

import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.dto.BorrowCreateRequestDTO;
import java.util.List;

public interface RequestManagementService {
    
    /**
     * Lấy danh sách toàn bộ yêu cầu để hiển thị trên bảng quản lý
     */
    List<ServiceRequestDTO> getAllRequests();

    /**
     * Tìm kiếm yêu cầu theo tên sinh viên
     */
    List<ServiceRequestDTO> searchRequestsByName(String name);

    /**
     * Tìm kiếm lịch sử mượn theo tên thiết bị hoặc mã yêu cầu (REQ-YYYY-ID)
     * @param keyword từ khóa tìm kiếm
     * @return danh sách yêu cầu khớp với từ khóa
     */
    List<ServiceRequestDTO> searchHistory(String keyword);

    /**
     * Lấy chi tiết một yêu cầu cụ thể để đổ dữ liệu lên Popup
     */
    ServiceRequestDTO getRequestById(Long id);

    /**
     * Cập nhật trạng thái và lưu ghi chú xử lý.
     * Hỗ trợ logic chuyển tiếp trạng thái:
     * - PENDING -> APPROVED / REJECTED
     * - APPROVED -> RETURNED
     */
    ServiceRequestDTO updateRequestStatus(Long id, String status);

    /**
     * Gửi yêu cầu mượn thiết bị mới.
     * @param requestDTO dữ liệu từ form yêu cầu
     * @return thông tin yêu cầu vừa được tạo
     */
    ServiceRequestDTO createBorrowRequest(BorrowCreateRequestDTO requestDTO);
}