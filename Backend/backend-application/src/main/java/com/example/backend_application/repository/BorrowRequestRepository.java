package com.example.backend_application.repository;

import com.example.backend_application.entity.BorrowRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_application.view.BorrowRequestView;
import com.example.backend_application.dto.DeviceTopDTO;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {
    
    // 1. Thao tác lưu/sửa sẽ dùng hàm .save() có sẵn của JpaRepository<BorrowRequest, Long>
    
    // 2. Các hàm đọc từ View: Vẫn để ở đây, Spring vẫn thực thi được bình thường
    @Query("SELECT v FROM BorrowRequestView v")
    List<BorrowRequestView> findAllViews();

    @Query("SELECT v FROM BorrowRequestView v WHERE v.studentName LIKE %:name%")
    List<BorrowRequestView> findByStudentNameContaining(@Param("name") String name);

    @Query("SELECT v FROM BorrowRequestView v WHERE v.idRequest = :id")
    Optional<BorrowRequestView> findByIdRequest(@Param("id") Long id);

    @Modifying
    @Query("UPDATE BorrowRequest b SET b.status = :status, " +
           "b.actualReturnDate = CASE WHEN :status = 'RETURNED' THEN CURRENT_TIMESTAMP ELSE b.actualReturnDate END " +
           "WHERE b.id = :id")
    int updateRequestDetails(@Param("id") Long id, @Param("status") String status);

   @Query("SELECT new com.example.backend_application.dto.DeviceTopDTO(v.deviceName, COUNT(v)) " +
           "FROM BorrowRequestView v " +
           "WHERE v.status <> 'REJECTED' " +
           "GROUP BY v.deviceName " +
           "ORDER BY COUNT(v) DESC")
    List<DeviceTopDTO> findTop5MostBorrowedDevices(Pageable pageable);

   @Query(value = 
    "SELECT s.status_name as status, COALESCE(v.cnt, 0) as count " +
    "FROM (SELECT 'RETURNED' AS status_name UNION ALL " +
    "      SELECT 'PENDING' UNION ALL " +
    "      SELECT 'REJECTED' UNION ALL " +
    "      SELECT 'APPROVED' UNION ALL " +
    "      SELECT 'OVERDUE') s " +
    "LEFT JOIN ( " +
    "    SELECT status, COUNT(*) AS cnt " +
    "    FROM view_borrow_request_details " +
    "    GROUP BY status " +
    ") v ON s.status_name = v.status", 
    nativeQuery = true)
List<Object[]> getBorrowStatistics();
}