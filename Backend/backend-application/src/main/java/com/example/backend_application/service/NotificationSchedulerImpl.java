package com.example.backend_application.service;

import com.example.backend_application.entity.BorrowRequest;
import com.example.backend_application.entity.Notification;
import com.example.backend_application.entity.User;
import com.example.backend_application.repository.BorrowRequestRepository;
import com.example.backend_application.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationSchedulerImpl implements NotificationScheduler {

    @Autowired 
    private BorrowRequestRepository borrowRequestRepository;
    
    @Autowired 
    private NotificationRepository notificationRepository;

    @Override
    @Transactional
    // Đang để 0 * * * * * để test mỗi phút. Khi chạy thật hãy đổi lại thành "0 0 8 * * *"
    @Scheduled(cron = "0 * * * * *", zone = "Asia/Ho_Chi_Minh")
    public void autoCheckDeadline() {
        System.out.println(">>> Scheduler bắt đầu quét đơn: " + LocalDateTime.now());
        
        List<BorrowRequest> requests = borrowRequestRepository.findAll();
        System.out.println(">>> Tổng số bản ghi tìm thấy trong DB: " + requests.size());

        LocalDate today = LocalDate.now();

        for (BorrowRequest req : requests) {
            // Chỉ xử lý đơn APPROVED
            if (!"APPROVED".equals(req.getStatus())) {
                continue;
            }

            if (req.getExpectedReturnDate() == null) {
                System.out.println(">>> [DEBUG] ID " + req.getId() + " bị null ngày trả.");
                continue;
            }

            LocalDate deadline = req.getExpectedReturnDate();
            System.out.println(">>> [DEBUG] Kiểm tra ID: " + req.getId() + " | Hạn trả: " + deadline + " | Hôm nay: " + today);

            // 1. QUÁ HẠN: Hạn < Hôm nay
            if (deadline.isBefore(today)) {
                req.setStatus("OVERDUE");
                borrowRequestRepository.save(req);
                saveAutoNotification(req.getAppUser(), "Cảnh báo quá hạn", 
                    "Thiết bị ID: " + req.getDeviceItemId() + " đã quá hạn trả!");
                System.out.println(">>> Đã chuyển trạng thái sang OVERDUE cho đơn ID: " + req.getId());
            } 
            // 2. SẮP ĐẾN HẠN: Hạn = Hôm nay + 1 ngày
            else if (deadline.isEqual(today.plusDays(1))) {
                saveAutoNotification(req.getAppUser(), "Nhắc nhở", 
                    "Thiết bị ID: " + req.getDeviceItemId() + " sắp đến hạn trả vào ngày mai.");
                System.out.println(">>> Đã gửi nhắc nhở cho đơn ID: " + req.getId());
            }
        }
        System.out.println(">>> Scheduler kết thúc.");
    }

    private void saveAutoNotification(User user, String title, String content) {
        if (user == null) return;
        
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setContent(content);
        n.setIsRead(false);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }
}