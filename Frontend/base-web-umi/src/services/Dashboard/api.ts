import { request } from 'umi';

/**
 * 🔄 API Lấy toàn bộ số liệu báo cáo và biểu đồ thống kê từ hệ thống Backend
 * @returns Trả về Promise chứa cấu trúc dữ liệu của DashboardDataResponse từ Namespace
 */
export async function getDashboardStatistics() {
  // Sử dụng trực tiếp kiểu dữ liệu từ namespace DashboardAPI mà không cần import
  return request<DashboardAPI.DashboardDataResponse>('/api/dashboard/statistics', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}