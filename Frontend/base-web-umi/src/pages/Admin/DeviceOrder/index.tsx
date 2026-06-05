import React, { useState, useEffect } from 'react';
import { Table, Input, Card, Button, Tag, Select } from 'antd';
import { useModel } from 'umi';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import DetailModal from './form';

const RequestManagement: React.FC = () => {
  const { requests, loading, fetchRequests, handleUpdateStatus } = useModel('deviceOrder.requestModel');
  
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = (requests || []).filter((item: any) => {
    const studentName = item?.studentName || item?.student?.name || '';
    const matchesSearch = studentName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'cho_duyet': { color: 'warning', text: 'Chờ duyệt' },
      'da_duyet': { color: 'processing', text: 'Đã duyệt' },
      'da_tra': { color: 'success', text: 'Đã trả' },
      'tu_choi': { color: 'error', text: 'Từ chối' },
      'qua_han': { color: 'magenta', text: 'Quá hạn' },
    };
    const config = statusMap[status] || { color: 'default', text: status || 'N/A' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    { title: 'Mã yêu cầu', dataIndex: 'id', key: 'id' },
    { 
      title: 'Sinh viên', 
      dataIndex: 'studentName', 
      key: 'studentName',
      align: 'center' as const,
      render: (_: any, record: any) => record.studentName || record.student?.name || 'N/A'
    },
    { 
      title: 'Thiết bị', 
      dataIndex: 'deviceName', 
      key: 'deviceName', 
      align: 'center' as const,
      render: (_: any, record: any) => record.device?.name || record.deviceName 
    },
    { title: 'SL', dataIndex: 'quantity', key: 'quantity', width: 60,align: 'center' as const },
    { title: 'Ngày mượn', dataIndex: 'borrowDate', key: 'borrowDate',align: 'center' as const },
    { title: 'Hạn trả', dataIndex: 'returnDate', key: 'returnDate',align: 'center' as const },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status', 
      align: 'center' as const,
      render: (status: string) => renderStatusTag(status) 
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      width: 90,
      render: (_: any, record: any) => (
        <Button 
          type="text" 
          icon={<EyeOutlined style={{ fontSize: '16px' }} />} 
          onClick={() => { 
            setSelectedRecord(record); 
            setModalOpen(true); 
          }} 
        />
      ),
    },
  ];

return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: '20px', color: '#1f1f1f' }}>
          Quản lý yêu cầu mượn thiết bị
        </h2>
        <h2 style={{ margin: 1, fontWeight: 600, fontSize: '12px', color: '#898787' }}>Xem, duyệt hoặc từ chối các yêu cầu mượn thiết bị</h2>
      </div>

      <div className="customSearchBox" style={{ 
        backgroundColor: '#ffffff', 
        padding: '16px 24px', 
        borderRadius: '10px', 
        marginBottom: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        display: 'flex', 
        gap: '16px',
        alignItems: 'center'
      }}>
        <Input
          placeholder="Tìm kiếm theo tên thiết bị, sinh viên..."
          allowClear
          style={{ flex: 1, borderRadius: '8px' }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          defaultValue="ALL"
          style={{ width: 180, borderRadius: '16px' }}
          dropdownStyle={{ borderRadius: '16px' }}
          onChange={(value) => setStatusFilter(value)}
          options={[
            { value: 'ALL', label: 'Tất cả trạng thái' },
            { value: 'cho_duyet', label: 'Chờ duyệt' },
            { value: 'da_duyet', label: 'Đã duyệt' },
            { value: 'tu_choi', label: 'Từ chối' },
            { value: 'da_tra', label: 'Đã trả' },
            { value: 'qua_han', label: 'Quá hạn' },
          ]}
        />
      </div>

      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px 24px', 
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}>
        <Table
          loading={loading}
          dataSource={filteredRequests}
          columns={columns}
          rowKey="id"
          pagination={{ 
            defaultPageSize: 10, 
            showSizeChanger: true,
            locale: { items_per_page: '/ trang' }
          }}
        />
      </div>

      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        record={selectedRecord}
        onUpdateStatus={async (params) => {
          const success = await handleUpdateStatus(params);
          if (success) fetchRequests();
          return success;
        }}
      />
    </div>
  );
};
export default RequestManagement;