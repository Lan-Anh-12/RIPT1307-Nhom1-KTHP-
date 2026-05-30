package com.example.backend_application.repository;

import com.example.backend_application.entity.BorrowRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BorrowRequestEntityRepository extends JpaRepository<BorrowRequest, Long> {
    // Kế thừa JpaRepository là đủ để có hàm save(), findById(), v.v.
}