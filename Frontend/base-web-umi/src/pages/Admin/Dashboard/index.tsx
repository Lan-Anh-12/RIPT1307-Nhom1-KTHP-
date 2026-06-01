import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { Column, Pie } from '@ant-design/charts';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  WarningOutlined 
} from '@ant-design/icons';

const DeviceDashboard: React.FC = () => {
  const { 
    loading, 
    summaryData, 
    topDevicesData, 
    statusDistributionData, 
    fetchDashboardData 
  } = useModel('Dashboard.dashboardModel');

  // Gọi API/Mock lấy dữ liệu ngay khi giao diện được render
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

// cấu hình biểu đồ cột
  const columnConfig = {
    data: topDevicesData,
    xField: 'deviceName',
    yField: 'count',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
    meta: {
      deviceName: { alias: 'Thiết bị' },
      count: { alias: 'Lượt mượn' },
    },
    color: '#00a870', // Màu xanh lục chủ đạo khít theo thiết kế ban đầu
    columnStyle: {
      borderRadius: '4px 4px 0 0', // Bo góc nhẹ phần đỉnh cột
    },
  };

// cấu hình biểu đồ tròn
  const colorMap: Record<string, string> = {
    'Đã trả': '#00a870',    // Xanh lục
    'Đã duyệt': '#e67e22',  // Cam
    'Chờ duyệt': '#d63031', // Đỏ
    'Từ chối': '#2980b9',   // Xanh dương
    'Quá hạn': '#7f8c8d',   // Xám
  };

  const donutConfig = {
    appendPadding: 10,
    data: statusDistributionData,
    angleField: 'value',
    colorField: 'status',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center' as const,
        fontSize: 14,
      },
    },
    color: ({ status }: { status: string }) => colorMap[status] || '#1890ff',
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: {
        offsetY: -10,
        style: { fontSize: '14px', color: '#8c8c8c' },
        formatter: () => 'Tổng đơn',
      },
      content: {
        offsetY: 4,
        style: { fontSize: '24px', fontWeight: 'bold' },
        formatter: () => `${summaryData.totalRequests}`,
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: '20px', color: '#1f1f1f' }}>Thống kê</h2>
        <p style={{ margin: 0, color: '#8c8c8c', fontSize: '14px' }}>Tổng quan và phân tích hoạt động mượn thiết bị</p>
      </div>

      <Spin spinning={loading} tip="Đang tải dữ liệu báo cáo thống kê..."> 
        
        {/* KHU VỰC 4 CARD ĐO LƯỜNG SỐ LIỆU */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} bodyStyle={{ padding: '20px 24px' }} style={{ borderRadius: '12px' }}>
              <Statistic
                title={<span style={{ color: '#8c8c8c' }}>Yêu cầu tháng này</span>}
                value={summaryData.totalRequests}
                valueStyle={{ fontWeight: 'bold', fontSize: '26px', color: '#1f1f1f' }}
                prefix={<FileTextOutlined style={{ color: '#00a870', backgroundColor: '#e6f7ff', padding: '8px', borderRadius: '8px', marginRight: '8px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} bodyStyle={{ padding: '20px 24px' }} style={{ borderRadius: '12px' }}>
              <Statistic
                title={<span style={{ color: '#8c8c8c' }}>Đã duyệt</span>}
                value={summaryData.approved}
                valueStyle={{ fontWeight: 'bold', fontSize: '26px', color: '#1f1f1f' }}
                prefix={<CheckCircleOutlined style={{ color: '#2f54eb', backgroundColor: '#f0f5ff', padding: '8px', borderRadius: '8px', marginRight: '8px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} bodyStyle={{ padding: '20px 24px' }} style={{ borderRadius: '12px' }}>
              <Statistic
                title={<span style={{ color: '#8c8c8c' }}>Quá hạn</span>}
                value={summaryData.overdue}
                valueStyle={{ fontWeight: 'bold', fontSize: '26px', color: '#b30000' }}
                prefix={<ClockCircleOutlined style={{ color: '#b30000', backgroundColor: '#fff1f0', padding: '8px', borderRadius: '8px', marginRight: '8px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} bodyStyle={{ padding: '20px 24px' }} style={{ borderRadius: '12px' }}>
              <Statistic
                title={<span style={{ color: '#8c8c8c' }}>Tồn kho </span>}
                value={summaryData.lowStock}
                valueStyle={{ fontWeight: 'bold', fontSize: '26px', color: '#fa8c16' }}
                prefix={<WarningOutlined style={{ color: '#fa8c16', backgroundColor: '#fff7e6', padding: '8px', borderRadius: '8px', marginRight: '8px' }} />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card 
              title={<span style={{ fontWeight: 600, fontSize: '16px' }}>Top 5 thiết bị mượn nhiều nhất trong tháng</span>}
              bordered={false}
              style={{ borderRadius: '12px', minHeight: '400px' }}
            >
              <div style={{ height: '300px' }}>
                <Column {...columnConfig} />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={<span style={{ fontWeight: 600, fontSize: '16px' }}>Phân bố trạng thái yêu cầu</span>}
              bordered={false}
              style={{ borderRadius: '12px', minHeight: '400px' }}
            >
              <div style={{ height: '300px' }}>
                <Pie {...donutConfig} />
              </div>
            </Card>
          </Col>
        </Row>

      </Spin>
    </div>
  );
};

export default DeviceDashboard;