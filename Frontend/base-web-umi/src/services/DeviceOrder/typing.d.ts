declare namespace API {
  type RequestStatus = 'cho_duyet' | 'da_duyet' | 'da_tra' | 'qua_han' | 'tu_choi';

  interface RequestItem {
    id: string; // Mã yêu cầu
    studentName: string;
    studentEmail: string;
    studentCode: string;
    totalRequests: number; // Tổng yêu cầu từ trước đến nay [cite: 7]
    deviceName: string; // Tên thiết bị [cite: 6]
    quantity: number; // Số lượng [cite: 6]
    requestDate: string; // Ngày gửi yêu cầu [cite: 6]
    borrowDate: string; // Ngày mượn [cite: 6]
    returnDate: string; // Ngày trả (hạn trả) [cite: 6]
    actualReturnDate?: string; // Ngày trả thực tế [cite: 6]
    status: RequestStatus; // Trạng thái [cite: 6]
  }

  interface UpdateStatusParams {
    id: string;
    status: RequestStatus;
    rejectReason?: string;
    actualReturnDate?: string;
  }
}