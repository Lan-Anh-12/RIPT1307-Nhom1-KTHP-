import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Input, Select, Tag, Button } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
// Import file component DetailModal gốc của bạn vào đây
import DetailModal from './form'; 

const DeviceOrder: React.FC = () => {
  const { requests, loading, fetchRequests, handleUpdateStatus } = useModel('deviceOrder.requestModel');

  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Trạng thái đóng/mở Modal và lưu bản ghi đang chọn chi tiết
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearch = () => {
    fetchRequests({ keyword: searchText, status: statusFilter });
  };

  // Mở Popup khi click xem chi tiết đơn
  const handleOpenDetails = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const columns = [
    { title: 'Mã yêu cầu', dataIndex: 'id', key: 'id', width: 100, align: 'center' as const },
    {
      title: 'Sinh viên yêu cầu', key: 'student',
      render: (_: any, record: any) => (
        <div>
          <b style={{ color: '#262626' }}>{record.studentName}</b>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.studentCode}</div>
        </div>
      )
    },
    { title: 'Thiết bị mượn', dataIndex: 'deviceName', key: 'deviceName' },
    { title: 'SL', dataIndex: 'quantity', key: 'quantity', width: 90, align: 'center' as const },
    { title: 'Ngày mượn', dataIndex: 'borrowDate', key: 'quantity', align: 'center' as const },
    { title: 'Hạn trả ', dataIndex: 'returnDate', key: 'returnDate', align: 'center' as const },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center' as const,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          'cho_duyet': { color: 'warning', text: 'Chờ duyệt' },
          'da_duyet': { color: 'processing', text: 'Đã duyệt' },
          'da_tra': { color: 'success', text: 'Đã trả' },
          'tu_choi': { color: 'error', text: 'Từ chối' },
          'qua_han': { color: 'magenta', text: 'Quá hạn' },
        };
        const config = statusMap[status] || { color: 'default', text: status || 'N/A' };
        return <Tag color={config.color} style={{ borderRadius: '4px' }}>{config.text}</Tag>;
      }
    },
    {
      title: 'Thao tác', key: 'action', align: 'center' as const, width: 130,
      render: (_: any, record: any) => (
        <Button 
          type="text" ghost size="small" 
          icon={<EyeOutlined style={{ color: '#000000', fontSize: '18px' }} />}          
          style={{ padding: 0, height: 'auto' }}
          onClick={() => handleOpenDetails(record)}
        >
        </Button>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: '20px', color: '#1f1f1f' }}>
          Quản lý yêu cầu mượn thiết bị
        </h2>
      </div>

      {/* THANH BỘ LỌC TỐI GIẢN - ĐỒNG BỘ CHUẨN PHONG CÁCH QUẢN LÝ KHO */}
      <div style={{ 
        backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', marginBottom: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', display: 'flex', gap: '16px', alignItems: 'center'
      }}>
        <Input
          placeholder="Tìm kiếm theo tên sinh viên, mã SV, tên thiết bị... (Nhấn Enter)"
          allowClear style={{ flex: 1 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          prefix={<SearchOutlined style={{ color: '#bfbfbf', marginRight: '4px' }} />}
        />
        <Select
          defaultValue="ALL" style={{ width: 180 }}
          onChange={(value) => {
            setStatusFilter(value);
            fetchRequests({ status: value, keyword: searchText });
          }}
          dropdownStyle={{ borderRadius: '8px' }}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            { value: 'cho_duyet', label: 'Chờ duyệt' },
            { value: 'da_duyet', label: 'Đã duyệt' },
            { value: 'da_tra', label: 'Đã trả' },
            { value: 'tu_choi', label: 'Từ chối' },
            { value: 'qua_han', label: 'Quá hạn' },
          ]}
        />
      </div>

      {/* BẢNG TỔNG QUAN DANH SÁCH */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)' }}>
        <Table
          loading={loading}
          dataSource={requests}
          columns={columns}
          rowKey="id"
        />
      </div>

      {/* GỌI ĐẾN FILE DETAIL MODAL GỐC CỦA BẠN VÀ KHỚP CÁC PROPS */}
      <DetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={selectedRecord}
        onUpdateStatus={handleUpdateStatus} // Truyền bệ phóng cập nhật dữ liệu của Model vào đây
      />

    </div>
  );
};

export default DeviceOrder;