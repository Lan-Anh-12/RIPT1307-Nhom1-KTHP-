import { useState, useCallback } from 'react';
import { getDashboardStatistics } from '@/services/Dashboard/api';

export default function useDeviceDashboardModel() {
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Số liệu của 4 ô Card tổng quan trên cùng (Mặc định bằng 0)
  const [summaryData, setSummaryData] = useState<DashboardAPI.SummaryData>({
    totalRequests: 0,
    approved: 0,
    overdue: 0,
    lowStock: 0,
  });

  // 2. Mảng dữ liệu cho biểu đồ Cột đứng
  const [topDevicesData, setTopDevicesData] = useState<DashboardAPI.TopDeviceItem[]>([]);

  // 3. Mảng dữ liệu cho biểu đồ Donut
  const [statusDistributionData, setStatusDistributionData] = useState<DashboardAPI.StatusDistributionItem[]>([]);

  /** Hàm fetch dữ liệu kết nối trực tiếp với Endpoint Backend */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi Service API và ép kiểu về DashboardDataResponse của bạn
      const res = (await getDashboardStatistics()) as DashboardAPI.DashboardDataResponse;

      // Xử lý khi Backend phản hồi thành công và có dữ liệu
      if (res && res.success && res.data) {
        const { summary, topDevices, statusDistribution } = res.data;

        setSummaryData(summary || { totalRequests: 0, approved: 0, overdue: 0, lowStock: 0 });
        setTopDevicesData(topDevices || []);
        setStatusDistributionData(statusDistribution || []);
      }
    } catch (error) {
      console.error(' Lỗi kết nối hoặc Backend chưa bật API Dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    summaryData,
    topDevicesData,
    statusDistributionData,
    fetchDashboardData,
  };
}