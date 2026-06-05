import { request } from 'umi';

// API lấy danh sách thiết bị hoạt động từ hệ thống
export async function getActiveDevices(): Promise<{ data: BorrowRequestSpace.DeviceModel[] }> {
	return request('/api/device-models', {
		method: 'GET',
		params: { status: 'ACTIVE' },
	});
}

// API gửi dữ liệu đơn mượn lên server lưu vào DB
export async function createBorrowRequest(payload: BorrowRequestSpace.CreateBorrowPayload): Promise<any> {
	return request('/api/borrow-requests', {
		method: 'POST',
		data: payload,
	});
}
