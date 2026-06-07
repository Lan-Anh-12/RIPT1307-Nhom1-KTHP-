import axios from '@/utils/axios';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

/**
 * 1. API Top 5 thiết bị (GET /api/statistics/top-devices?limit=5)
 */
export async function getTopDevices(limit: number = 5) {
  return axios.get<DashboardAPI.TopDeviceItem[]>(`${BASE_URL}/api/statistics/top-devices`, {
    params: { limit }
  });
}

/**
 * 2. API Thống kê trạng thái đơn mượn (GET /api/statistics/borrow-stats)
 */
export async function getBorrowStats() {
  return axios.get<DashboardAPI.StatusDistributionItem[]>(`${BASE_URL}/api/statistics/borrow-stats`);
}