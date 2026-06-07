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

