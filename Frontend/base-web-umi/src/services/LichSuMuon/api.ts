import { request } from 'umi';

// 1. API lấy toàn bộ danh sách lịch sử mượn của User từ Token
export async function getBorrowHistoryList(): Promise<BorrowHistorySpace.HistoryItem[]> {
	return request('/api/requests/user', {
		method: 'GET',
	});
}

// 2. API thực hiện hủy đơn mượn (Lan Anh thiết kế nhận PUT để cập nhật status thành REJECTED)
export async function cancelBorrowRequest(id: number): Promise<any> {
	return request(`/api/requests/${id}/cancel`, {
		method: 'PUT',
	});
}
