import { useState, useCallback } from 'react';
import { getDashboardStatistics } from '@/services/Dashboard/api';

export default function useDeviceDashboardModel() {
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Số liệu của 4 ô Card tổng quan trên cùng (Sử dụng Type định nghĩa sẵn)
  const [summaryData, setSummaryData] = useState<DashboardAPI.SummaryData>({
    totalRequests: 8,
    approved: 2,
    overdue: 1,
    lowStock: 3,
  });

  // 2. Mảng dữ liệu cho biểu đồ Cột đứng
  const [topDevicesData, setTopDevicesData] = useState<DashboardAPI.TopDeviceItem[]>([
    { deviceName: 'Máy chiếu Epson', count: 2 },
    { deviceName: 'Loa di động JBL', count: 2 },
    { deviceName: 'Màn hình LED', count: 2 },
    { deviceName: 'Máy tính xách tay', count: 1 },
    { deviceName: 'Bảng tương tác', count: 1 },
  ]);

  // 3. Mảng dữ liệu cho biểu đồ Donut
  const [statusDistributionData, setStatusDistributionData] = useState<DashboardAPI.StatusDistributionItem[]>([
    { status: 'Đã trả', value: 3 },
    { status: 'Đã duyệt', value: 2 },
    { status: 'Chờ duyệt', value: 3 },
    { status: 'Từ chối', value: 1 },
    { status: 'Quá hạn', value: 1 },
  ]);

  /** 🔄 Hàm fetch dữ liệu kết nối từ Service */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDashboardStatistics();
      if (res?.success && res?.data) {
        setSummaryData(res.data.summary);
        setTopDevicesData(res.data.topDevices);
        setStatusDistributionData(res.data.statusDistribution);
      }
    } catch (error) {
      console.log('Chưa bật server API backend, hệ thống tiếp tục duy trì dữ liệu Mock Test.');
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