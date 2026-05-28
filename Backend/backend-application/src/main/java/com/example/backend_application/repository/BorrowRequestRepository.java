package com.example.backend_application.repository;

import com.example.backend_application.view.BorrowRequestView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequestView, Long> {
    
    // Tìm kiếm theo tên sinh viên sẵn có trong View
    List<BorrowRequestView> findByStudentNameContaining(String studentName);
    
    // Lấy toàn bộ danh sách từ View
    List<BorrowRequestView> findAll();

    // Truy vấn lấy chi tiết 1 bản ghi từ View dựa vào idRequest phục vụ Popup
    Optional<BorrowRequestView> findByIdRequest(Long idRequest);

    // Sử dụng Native Query hoặc JPQL cập nhật bảng gốc borrow_request khi Admin duyệt/từ chối từ giao diện
    @Modifying
    @Query("UPDATE BorrowRequest b SET b.status = :status, " +
       "b.actualReturnDate = CASE " +
       "WHEN :status = 'RETURNED' THEN CURRENT_TIMESTAMP " +
       "ELSE b.actualReturnDate END " +
       "WHERE b.id = :id")
    int updateRequestDetails(@Param("id") Long id, @Param("status") String status);
}