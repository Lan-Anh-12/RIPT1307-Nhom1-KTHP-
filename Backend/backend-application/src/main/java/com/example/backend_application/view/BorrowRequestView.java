package com.example.backend_application.view;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "view_borrow_request_details") // Tên của View bạn đã tạo trong DB
@Getter
@Setter
public class BorrowRequestView {
    @Id
    private Long idRequest; // Phải có @Id để Hibernate nhận diện
    private Long studentId;
    private String studentName;
    private String email;
    private String deviceName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDate expectedReturnDate;
    private LocalDate actualReturnDate;
    private Integer quantity;
    private Integer totalRequest;
}