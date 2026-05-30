package com.example.backend_application.dto;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationResponse {
    private Long id;
    private Long idStudent;
    private String title;
    private String content; // "Yêu cầu mượn thiết bị"+ tên thiết bị + "của bạn đã được chấp nhận"
    private Boolean isRead; // "Yêu cầu mượn thiết bị"+ tên thiết bị + "của bạn đã bị từ chối"
                            // "yêu cầu mượn thiết bị"+ tên thiết bị + "của bạn đã được trả lại"
                            // "yêu cầu mượn thiết bị"+ tên thiết bị + "của bạn sắp đến hạn trả lại"
}
