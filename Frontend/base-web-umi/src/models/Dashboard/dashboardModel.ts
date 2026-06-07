import { useState, useCallback } from 'react';
import { getTopDevices, getBorrowStats } from '@/services/Dashboard/api';

export default function useDeviceDashboardModel() {
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<DashboardAPI.SummaryData>({
    totalRequests: 0, approved: 0, overdue: 0, lowStock: 0,
  });
  const [topDevicesData, setTopDevicesData] = useState<DashboardAPI.TopDeviceItem[]>([]);
  const [statusDistributionData, setStatusDistributionData] = useState<DashboardAPI.StatusDistributionItem[]>([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [topRes, statsRes] = await Promise.all([
        getTopDevices(5),
        getBorrowStats()
      ]);

      const topDevices = (topRes as any) || [];
      const statsList = (statsRes as any) || []; // Mảng chứa các trạng thái

      setTopDevicesData(topDevices);
      setStatusDistributionData(statsList);

      // 🌟 KHỚP DỮ LIỆU VÀO 4 Ô CARD
      // Giả sử statsList là: [{status: "APPROVED", count: 3}, {status: "OVERDUE", count: 1}, ...]
      const total = statsList.reduce((sum: number, item: any) => sum + (item.count || 0), 0);
      const approved = statsList.find((i: any) => i.status === 'APPROVED')?.count || 0;
      const overdue = statsList.find((i: any) => i.status === 'OVERDUE')?.count || 0;

      setSummaryData({
        totalRequests: total,
        approved: approved,
        overdue: overdue,
        lowStock: 0, // Nếu API không trả về tồn kho, bạn có thể để 0 hoặc lấy từ API khác
      });

    } catch (error) {
      console.error('Lỗi tải Dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, summaryData, topDevicesData, statusDistributionData, fetchDashboardData };
}