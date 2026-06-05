package com.example.backend_application.service;

import com.example.backend_application.entity.BorrowRequest;
import com.example.backend_application.entity.Notification;
import com.example.backend_application.entity.User;
import com.example.backend_application.repository.NotificationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.backend_application.repository.BorrowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationSchedulerImpl implements NotificationScheduler {
    @Autowired private BorrowRequestRepository borrowRequestRepository;
    @Autowired private NotificationRepository notificationRepository;

    @Override
    @Scheduled(cron = "0 0 8 * * *") // 8h sáng hàng ngày
    public void autoCheckDeadline() {
        LocalDate today = LocalDate.now();
        List<BorrowRequest> requests = borrowRequestRepository.findAll();

        for (BorrowRequest req : requests) {
            if (!"APPROVED".equals(req.getStatus())) continue;

            // Sử dụng getAppUser() thay vì getUser()
            User user = req.getAppUser();
            // Sử dụng deviceItemId thay vì deviceName
            String deviceIdentifier = "Thiết bị ID: " + req.getDeviceItemId();

            // 1. Quá hạn
            if (req.getExpectedReturnDate().isBefore(today)) {
                req.setStatus("OVERDUE");
                borrowRequestRepository.save(req);
                saveAutoNotification(user, "Cảnh báo quá hạn", deviceIdentifier + " đã quá hạn trả!");
            } 
            // 2. Trước 1 ngày
            else if (req.getExpectedReturnDate().equals(today.plusDays(1))) {
                saveAutoNotification(user, "Nhắc nhở", deviceIdentifier + " sắp đến hạn trả vào ngày mai.");
            }
        }
    }

    private void saveAutoNotification(User user, String title, String content) {
        // Lưu ý: Logic này sẽ tạo mới mỗi ngày. 
        // Nếu muốn tránh spam, bạn nên kiểm tra xem trong database đã tồn tại thông báo cùng nội dung chưa.
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setContent(content);
        n.setIsRead(false);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }
}