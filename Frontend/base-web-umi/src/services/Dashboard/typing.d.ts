declare namespace DashboardAPI {
  /** Chỉ số đo lường của 4 ô Card tổng quan trên cùng */
  type SummaryData = {
    totalRequests: number;
    approved: number;
    overdue: number;
    lowStock: number;
  };

  /** Cấu trúc một phần tử trong danh sách Top 5 thiết bị mượn nhiều */
  type TopDeviceItem = {
    deviceName: string;
    count: number;
  };

  /** Cấu trúc một phần tử trong phân bổ trạng thái yêu cầu mượn */
  type StatusDistributionItem = {
    status: string;
    value: number;
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