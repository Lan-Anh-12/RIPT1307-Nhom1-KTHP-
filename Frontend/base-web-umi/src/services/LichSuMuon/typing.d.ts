declare namespace BorrowHistorySpace {
	// Cấu trúc dữ liệu lịch sử mượn trả thiết bị
	interface HistoryItem {
		idRequest: number;
		studentId: number;
		studentName: string;
		device: string;
		quantity: number;
		requestDate: string;
		actualReturnDate: string | null;
		expectedReturnDate: string;
		status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | string;
		totalRequest: number;
		email: string;
	}

	// Cấu trúc dữ liệu thống kê trạng thái yêu cầu
	interface HistoryStats {
		pending: number;
		approved: number;
		rejected: number;
		returned: number;
	}
}
