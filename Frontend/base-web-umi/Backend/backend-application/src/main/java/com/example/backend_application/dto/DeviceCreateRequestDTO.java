package com.example.backend_application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceCreateRequestDTO {
    private String name;
    private Long categoryId;
    private String imageUrl;
    private Integer quantity;
    private String description;
}
