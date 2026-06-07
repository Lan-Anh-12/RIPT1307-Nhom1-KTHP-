import { request } from 'umi';

// API lấy danh sách thiết bị thực tế từ Backend (Không bao gồm status DELETED)
export async function getActiveDevices(): Promise<BorrowRequestSpace.DeviceModel[]> {
	return request('/api/devices', {
		method: 'GET',
	});
}

// API gửi yêu cầu mượn thiết bị mới chuẩn Backend Lan Anh
export async function createBorrowRequest(payload: BorrowRequestSpace.CreateBorrowPayload): Promise<any> {
	return request('/api/requests/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		data: payload,
	});
}
