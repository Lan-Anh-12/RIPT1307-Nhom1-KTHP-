import { request } from 'umi';

// 1. API lấy toàn bộ danh sách lịch sử mượn của User đang đăng nhập
export async function getBorrowHistoryList(): Promise<{ data: BorrowHistorySpace.HistoryItem[] }> {
	return request('/api/borrow-requests/history', {
		method: 'GET',
	});
}

// 2. API thực hiện hủy đơn mượn (Xóa hoặc đổi trạng thái sang REJECTED/CANCELLED dưới DB)
export async function cancelBorrowRequest(id: string): Promise<any> {
	return request(`/api/borrow-requests/${id}/cancel`, {
		method: 'POST',
	});
}
