import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Input, Select, Tag, Button } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import NotificationBell from './notify';
import DetailModal from './form'; 

const DeviceOrder: React.FC = () => {
  // Gọi các trạng thái và hàm từ Model (Đảm bảo đường dẫn namespace 'deviceOrder.requestModel' khớp với config của bạn)
  const { 
    requests, 
    loading, 
    currentRequest, 
    fetchRequests, 
    fetchRequestDetail, 
    handleUpdateStatus 
  } = useModel('deviceOrder.requestModel');

  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Trạng thái đóng/mở Modal chi tiết
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Tải danh sách yêu cầu lần đầu tiên khi mở trang
  useEffect(() => {
    fetchRequests({ keyword: searchText, status: statusFilter });
  }, [fetchRequests]);

  const handleSearch = () => {
    fetchRequests({ keyword: searchText, status: statusFilter });
  };

  // 🔍 Mở Popup khi click xem chi tiết đơn - Kích hoạt API lấy từ Database qua mã idRequest thật
  const handleOpenDetails = async (record: DeviceRequest.RequestItem) => {
    if (fetchRequestDetail) {
      await fetchRequestDetail(record.idRequest);
    }
    setIsModalOpen(true);
  };

  // 📋 Cấu hình các cột của bảng hiển thị - Đã map chuẩn 100% trường dữ liệu Java DTO
  const columns = [
    { 
      title: 'Mã yêu cầu', 
      dataIndex: 'idRequest', 
      key: 'idRequest', 
      width: 110, 
      align: 'center' as const 
    },
    {
      title: 'Sinh viên yêu cầu', 
      key: 'student',
      render: (_: any, record: DeviceRequest.RequestItem) => (
        <div>
          <b style={{ color: '#262626' }}>{record.studentName}</b>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>ID Sinh viên: {record.studentId}</div>
        </div>
      )
    },
    { 
      title: 'Thiết bị mượn', 
      dataIndex: 'device', 
      key: 'device',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    { 
      title: 'SL', 
      dataIndex: 'quantity', 
      key: 'quantity', 
      width: 80, 
      align: 'center' as const 
    },
    { 
      title: 'Ngày mượn', 
      dataIndex: 'requestDate', 
      key: 'requestDate', 
      align: 'center' as const 
    }, 
    { 
      title: 'Hạn trả dự kiến', 
      dataIndex: 'expectedReturnDate', 
      key: 'expectedReturnDate', 
      align: 'center' as const 
    },
    {
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status', 
      align: 'center' as const,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          'PENDING': { color: 'warning', text: 'Chờ duyệt' },
          'APPROVED': { color: 'processing', text: 'Đã duyệt' },
          'RETURNED': { color: 'success', text: 'Đã trả' },
          'REJECTED': { color: 'error', text: 'Từ chối' },
          'OVERDUE': { color: 'magenta', text: 'Quá hạn' }, // Backend quét gửi thông báo quá hạn tự động
        };
        const upperStatus = status?.toUpperCase() || 'PENDING';
        const config = statusMap[upperStatus] || { color: 'default', text: status || 'N/A' };
        return <Tag color={config.color} style={{ borderRadius: '4px' }}>{config.text}</Tag>;
      }
    },
    {
      title: 'Thao tác', 
      key: 'action', 
      align: 'center' as const, 
      width: 100,
      render: (_: any, record: DeviceRequest.RequestItem) => (
        <Button 
          type="text" 
          size="small" 
          icon={<EyeOutlined style={{ color: '#1890ff', fontSize: '18px' }} />}          
          style={{ padding: 0, height: 'auto', border: 'none', background: 'transparent' }}
          onClick={() => handleOpenDetails(record)}
        />
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      
      {/* THANH TIÊU ĐỀ TRÊN CÙNG & QUẢ CHUÔNG THÔNG BÁO QUÁ HẠN */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: '20px', color: '#1f1f1f' }}>Quản lý yêu cầu mượn thiết bị</h2>
        
        {/* Component quả chuông hiển thị thông báo quá hạn tự động */}
        <NotificationBell />

      </div>

      {/* BỘ LỌC TÌM KIẾM THEO TÊN VÀ TRẠNG THÁI */}
      <div style={{ 
        backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', marginBottom: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', display: 'flex', gap: '16px', alignItems: 'center'
      }}>
        <Input
          placeholder="Tìm kiếm theo tên sinh viên..."
          allowClear 
          style={{ flex: 1, borderRadius: '6px' }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            if (!e.target.value) fetchRequests({ keyword: '', status: statusFilter });
          }}
          onPressEnter={handleSearch}
          prefix={<SearchOutlined style={{ color: '#bfbfbf', marginRight: '4px' }} />}
        />
        <Select
          value={statusFilter} 
          style={{ width: 190 }}
          onChange={(value) => {
            setStatusFilter(value);
            fetchRequests({ status: value, keyword: searchText });
          }}
          dropdownStyle={{ borderRadius: '8px' }}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            { value: 'PENDING', label: 'Chờ duyệt' },
            { value: 'APPROVED', label: 'Đã duyệt' },
            { value: 'RETURNED', label: 'Đã trả' },
            { value: 'REJECTED', label: 'Từ chối' },
            { value: 'OVERDUE', label: 'Quá hạn' },
          ]}
        />
      </div>

      {/* BẢNG CHỨA DANH SÁCH ĐƠN HÀNG THỰC TẾ TỪ JAVA BACKEND */}
      <div style={{ backgroundColor: '#ffffff', padding: '12px 0px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', overflow: 'hidden' }}>
        <Table
          loading={loading}
          dataSource={requests}
          columns={columns}
          rowKey="idRequest" // Sử dụng khóa chính duy nhất idRequest từ ServiceRequestDTO
          pagination={{ defaultPageSize: 10, locale: { items_per_page: '/ trang' } }}
        />
      </div>
      
      {/* MODAL POPUP CHI TIẾT PHÊ DUYỆT VÀ NHẬN TRẢ ĐỒ */}
      <DetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={currentRequest} // Truyền dữ liệu chi tiết thời gian thực từ API
        onUpdateStatus={async (id: string | number, status: string) => {
          // Bọc lệnh cập nhật trạng thái đồng bộ hóa ngược lại bảng chính
          const success = await handleUpdateStatus(Number(id), status as any, searchText, statusFilter);
          if (success) {
            setIsModalOpen(false);
          }
        }} 
      />

    </div>
  );
};

export default DeviceOrder;