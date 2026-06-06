declare namespace BorrowHistorySpace {
	// Cấu trúc dữ liệu chuẩn trả về từ BorrowResponseDTO của Java
	interface HistoryItem {
		id: number; // ID tự tăng kiểu Long dưới DB
		deviceItemId: number;
		deviceName: string; // Tên thiết bị tương ứng
		quantity: number; // Số lượng mượn
		requestDate: string; // Ngày gửi yêu cầu (YYYY-MM-DD)
		expectedReturnDate: string; // Ngày hẹn trả (YYYY-MM-DD)
		actualReturnDate: string | null; // Ngày trả thực tế
		status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED'; // Enum chuẩn hệ thống
	}

	// Thống kê số lượng dựa theo Enum hệ thống
	interface HistoryStats {
		pending: number;
		approved: number;
		rejected: number;
		returned: number;
	}
}
