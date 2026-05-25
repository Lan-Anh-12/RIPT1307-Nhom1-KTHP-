package com.example.backend_application.view;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Immutable;

@Entity
@Table(name = "view_device_details")
@Immutable // Đánh dấu View là không thể thay đổi dữ liệu từ Java
@Data
public class DeviceView {

    @Id // JPA yêu cầu phải có một khóa chính, dù là View
    private Long deviceId;
    
    private String deviceName;
    private Integer stock;
    private String description;
    private String image;
    private String status;
    private Long categoryId;
    private String categoryName;
}