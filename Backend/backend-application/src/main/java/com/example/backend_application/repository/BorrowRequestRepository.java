package com.example.backend_application.repository;

import com.example.backend_application.entity.BorrowRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long>, JpaSpecificationExecutor<BorrowRequest> {
}
