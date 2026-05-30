package com.example.backend_application.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BorrowCreateRequestDTO {
    private Long id;
    private LocalDate requestDate;
    private LocalDate expectedReturnDate;
    private Long deviceItemId;
    private Integer quantity;
}