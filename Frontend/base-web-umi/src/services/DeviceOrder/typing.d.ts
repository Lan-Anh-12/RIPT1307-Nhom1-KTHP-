declare namespace DeviceRequest {
  interface RequestItem {
    idRequest: number;          // Mã yêu cầu (Long bên Java)
    studentId: number;          // Mã sinh viên
    studentName: string;        // Tên sinh viên mượn đồ
    device: string;             // Tên thiết bị mượn
    quantity: number;           // Số lượng mượn
    requestDate: string;        // Ngày mượn (LocalDate dạng YYYY-MM-DD)
    expectedReturnDate: string; // Ngày hẹn trả
    actualReturnDate?: string;  // Ngày thực tế trả đồ
    status: string;             // Trạng thái yêu cầu (PENDING, APPROVED, REJECTED, RETURNED)
    email?: string;             // Email sinh viên
    totalRequest?: number;
  }
}

declare namespace DeviceNotification {
  interface NotificationItem {
    id: number;           // Khóa chính
    userId: number;       // ID của sinh viên nhận thông báo
    title: string;        // Tiêu đề thông báo
    content: string;      // Nội dung thông báo tự động sinh ra từ hệ thống
    isRead: boolean;      // Trạng thái sinh viên đã đọc hay chưa
  }
}