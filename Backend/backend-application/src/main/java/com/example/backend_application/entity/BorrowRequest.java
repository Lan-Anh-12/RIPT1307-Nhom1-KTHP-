package com.example.backend_application.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "borrow_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "student_id", length = 50)
    private String studentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "expected_return_date")
    private LocalDate expectedReturnDate;

    @Column(name = "actual_return_date")
    private LocalDate actualReturnDate;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "device_item_id")
    private Long deviceItemId; 

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "app_user_id", referencedColumnName = "id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"}) // Chặn vòng lặp hoàn toàn
    private User appUser;
}