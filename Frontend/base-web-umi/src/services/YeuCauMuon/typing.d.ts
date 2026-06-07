declare namespace BorrowRequestSpace {
	// Cấu trúc của thiết bị lấy từ bảng device_model
	interface DeviceModel {
		id: number;
		name: string;
		quantity: number;
		description?: string;
		imageUrl?: string;
		status?: string;
		categoryId?: number;
	}

	// Cấu trúc dữ liệu Form người dùng nhập
	interface FormValues {
		deviceItemId: number;
		expectedReturnDate: any;
		quantity: number;
	}

	// Cấu trúc dữ liệu chuẩn để gửi lên Server
	interface CreateBorrowPayload {
		requestDate: string;
		expectedReturnDate: string;
		deviceItemId: number;
		quantity: number;
	}
}
