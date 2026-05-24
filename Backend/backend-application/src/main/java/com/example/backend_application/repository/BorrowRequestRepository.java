package com.example.backend_application.repository;

import com.example.backend_application.view.BorrowRequestView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequestView, Long> {
    
    // Tìm kiếm theo tên sinh viên trong View
    // Nó sẽ tự động sinh ra câu SQL: SELECT * FROM view_borrow_request_details WHERE student_name LIKE %?%
    List<BorrowRequestView> findByStudentNameContaining(String studentName);
    
    // Lấy toàn bộ danh sách
    List<BorrowRequestView> findAll();
}