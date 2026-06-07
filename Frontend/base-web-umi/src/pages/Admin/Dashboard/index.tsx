import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Statistic, Spin, Empty } from 'antd';
import { Column, Pie } from '@ant-design/charts';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';

const DeviceDashboard: React.FC = () => {
  // Lấy dữ liệu từ Model chung của hệ thống
  const { 
    loading, 
    summaryData, 
    topDevicesData, 
    statusDistributionData, 
    fetchDashboardData 
  } = useModel('Dashboard.dashboardModel');

  // Gọi API lấy dữ liệu thực tế từ Backend ngay khi render thành phần
  useEffect(() => {
    if (fetchDashboardData) {
      fetchDashboardData();
    }
  }, [fetchDashboardData]);

  // CẤU HÌNH BIỂU ĐỒ CỘT 
  const columnConfig = {
    data: topDevicesData || [],
    xField: 'deviceName',
    yField: 'borrowCount', 
    autoFit: true,
    padding: 'auto',
    appendPadding: [10, 10, 20, 10], 
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    meta: {
      deviceName: { alias: 'Thiết bị' },
      borrowCount: { alias: 'Lượt mượn' },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: true,
        style: {
          fontSize: 11,
          fill: '#595959',
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineDash: [4, 4],
          },
        },
      },
    },
    style: {
      fill: '#00a870', 
      radiusTopLeft: 4,
      radiusTopRight: 4,
    },
  };

  //  BẢNG MÀU ĐỒNG BỘ TRẠNG THÁI YÊU CẦU ĐƠN
  const colorMap: Record<string, string> = {
    'Đã trả': '#00a870',     
    'Đã duyệt': '#e67e22',   
    'Chờ duyệt': '#faad14',  
    'Từ chối': '#d63031',    
    'Quá hạn': '#7f8c8d',    
  };

  //  CẤU HÌNH BIỂU ĐỒ TRÒN DONUT 
  const donutConfig = {
    data: statusDistributionData || [],
    angleField: 'count', 
    colorField: 'status',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center' as const,
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    // Đổ màu chuẩn xác theo trạng thái bằng hàm Callback
    color: ({ status }: { status: string }) => {
      return colorMap[status] || '#1890ff';
    },
    legend: {
      position: 'right' as const,
    },

    statistic: {
      title: {
        offsetY: -12,
        style: {
          fontSize: '14px',
          color: '#8c8c8c',
          textAlign: 'center',
        },
        formatter: () => 'Tổng đơn',
      },
      content: {
        offsetY: 12,
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f1f1f',
          textAlign: 'center',
        },
        formatter: () => `${summaryData?.totalRequests || 0}`,
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      
      {/* KHU VỰC TIÊU ĐỀ */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: '20px', color: '#1f1f1f' }}>Thống kê hệ thống</h2>
        <p style={{ margin: 0, color: '#8c8c8c', fontSize: '14px' }}>Dữ liệu tổng quan và phân tích hoạt động mượn trả thiết bị</p>
      </div>

      <Spin spinning={loading} tip="Đang truy vấn dữ liệu thống kê từ Server Backend..."> 
        
        {/* 4 CARD CHỈ SỐ LỚN TRÊN CÙNG */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} bodyStyle={{ padding: '20px 24px' }} style={{ borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <Statistic
                title={<span style={{ color: '#8c8c8c' }}>Yêu cầu hệ thống</span>}
                value={summaryData?.totalRequests || 0}
                valueStyle={{ fontWeight: 'bold', fontSize: '26px', color: '#1f1f1f' }}
                prefix={<FileTextOutlined style={{ color: '#00a870', backgroundColor: '#e6f7ff', padding: '8px', borderRadius: '8px', marginRight: '8px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} bodyStyle={{ padding: '20px 24px' }} style={{ borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <Statistic
                title={<span style={{ color: '#8c8c8c' }}>Đang mượn</span>}
                value={summaryData?.approved || 0}
                valueStyle={{ fontWeight: 'bold', fontSize: '26px', color: '#1f1f1f' }}
                prefix={<CheckCircleOutlined style={{ color: '#2f54eb', backgroundColor: '#f0f5ff', padding: '8px', borderRadius: '8px', marginRight: '8px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} bodyStyle={{ padding: '20px 24px' }} style={{ borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <Statistic
                title={<span style={{ color: '#8c8c8c' }}>Quá hạn </span>}
                value={summaryData?.overdue || 0}
                valueStyle={{ fontWeight: 'bold', fontSize: '26px', color: '#b30000' }}
                prefix={<ClockCircleOutlined style={{ color: '#b30000', backgroundColor: '#fff1f0', padding: '8px', borderRadius: '8px', marginRight: '8px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} bodyStyle={{ padding: '20px 24px' }} style={{ borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <Statistic
                title={<span style={{ color: '#8c8c8c' }}>Từ chối</span>}
                value={summaryData?.rejected || 0} 
                valueStyle={{ fontWeight: 'bold', fontSize: '26px', color: '#d63031' }}
                prefix={<CloseCircleOutlined style={{ color: '#d63031', backgroundColor: '#fff1f0', padding: '8px', borderRadius: '8px', marginRight: '8px' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* KHU VỰC 2 ĐỒ THỊ CHI TIẾT */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card 
              title={<span style={{ fontWeight: 600, fontSize: '15px', color: '#262626' }}>Top 5 thiết bị mượn nhiều nhất</span>}
              bordered={false}
              style={{ borderRadius: '12px', minHeight: '400px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div style={{ height: '320px', paddingTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {topDevicesData && topDevicesData.length > 0 ? (
                  <div style={{ width: '100%', height: '100%' }}>
                    <Column {...(columnConfig as any)} />
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu thiết bị mượn" />
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={<span style={{ fontWeight: 600, fontSize: '15px', color: '#262626' }}>Phân bố trạng thái đơn mượn</span>}
              bordered={false}
              style={{ borderRadius: '12px', minHeight: '400px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
            >
              <div style={{ height: '320px', paddingTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {statusDistributionData && statusDistributionData.length > 0 ? (
                  <div style={{ width: '100%', height: '100%' }}>
                    <Pie {...(donutConfig as any)} />
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu phân bố trạng thái" />
                )}
              </div>
            </Card>
          </Col>
        </Row>

      </Spin>
    </div>
  );
};

export default DeviceDashboard;