import axios from '@/utils/axios';
const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

/**  1. API Lấy tất cả yêu cầu (Admin xem danh sách tổng)
 * GET /api/requests/all
 */
export async function getOrderList() {
  return axios.get<DeviceRequest.RequestItem[]>(`${BASE_URL}/api/requests/all`);
}

/**  2. API Tìm kiếm yêu cầu theo tên sinh viên (Thanh tìm kiếm chính)
 * GET /api/requests/search?name=...
 */
export async function searchRequestsByName(name: string) {
  return axios.get<DeviceRequest.RequestItem[]>(`${BASE_URL}/api/requests/search`, {
    params: { name },
  });
}

/**  3. API Tìm kiếm lịch sử mượn theo từ khóa
 * GET /api/requests/search-history?keyword=...
 */
export async function searchHistory(keyword: string) {
  return axios.get<DeviceRequest.RequestItem[]>(`${BASE_URL}/api/requests/search-history`, {
    method: 'GET',
    params: { keyword },
  });
}

/**  4. API Lấy chi tiết 1 yêu cầu theo ID (Dùng cho Popup xem chi tiết hoặc Popup duyệt)
 * GET /api/requests/{id}
 */
export async function getRequestById(id: number | string) {
  return axios.get<DeviceRequest.RequestItem>(`${BASE_URL}/api/requests/${id}`, {
  });
}

/** 5. API Cập nhật trạng thái đơn mượn/trả (Khớp Map<String, String> của Java)
 * PUT /api/requests/{id}/status
 * body gửi lên: { "status": "APPROVED" | "REJECTED" | "RETURNED" }
 */
export async function updateOrderStatus(idRequest: number | string, status: 'APPROVED' | 'REJECTED' | 'RETURNED') {
  return axios.put(`${BASE_URL}/api/requests/${idRequest}/status`, { status });
}

