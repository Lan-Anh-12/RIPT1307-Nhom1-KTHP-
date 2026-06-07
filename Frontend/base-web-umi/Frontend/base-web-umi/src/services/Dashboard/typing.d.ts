declare namespace DashboardAPI {
  /** Chỉ số đo lường của ô Card tổng quan  */
  type SummaryData = {
    totalRequests: number;
    approved: number;
    overdue: number;
    rejected: number;
    lowStock?: number;
  };

  /** Cấu trúc khớp với DeviceTopDTO.java */
  type TopDeviceItem = {
    deviceName: string;
    borrowCount: number; 
  };

  /** Cấu trúc khớp với StatusStatDTO.java */
  type StatusDistributionItem = {
    status: string;
    count: number; 
  };

  /** Dữ liệu cốt lõi nằm bên trong gói phản hồi thành công */
  type DashboardStatsData = {
    summary: SummaryData;
    topDevices: TopDeviceItem[];
    statusDistribution: StatusDistributionItem[];
  };

  /** Định nghĩa khuôn mẫu phản hồi chuẩn từ API Thống kê */
  type DashboardDataResponse = {
    success: boolean;
    data?: DashboardStatsData;
    errorMessage?: string;
  };
}