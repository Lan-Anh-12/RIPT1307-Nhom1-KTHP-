import { request } from 'umi';

/**
 * 🔄 API Lấy toàn bộ số liệu báo cáo và biểu đồ thống kê từ hệ thống Backend
 * @returns Trả về Promise chứa cấu trúc dữ liệu của DashboardDataResponse từ Namespace
 */
export async function getDashboardStatistics() {
  return request<DashboardAPI.DashboardDataResponse>('/api/statistics', {
    method: 'GET',
  });
}