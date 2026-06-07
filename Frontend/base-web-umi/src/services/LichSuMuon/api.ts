import axios from '@/utils/axios';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

// 1. API lấy toàn bộ danh sách lịch sử mượn của User từ Token
export async function getBorrowHistoryList(): Promise<BorrowHistorySpace.HistoryItem[]> {
    const response = await axios.get(`${BASE_URL}/api/requests/user`);
    return response.data;
}

// 2. API thực hiện hủy đơn mượn
export async function cancelBorrowRequest(id: number): Promise<any> {
    const response = await axios.put(`${BASE_URL}/api/requests/${id}/cancel`);
    return response.data;
}