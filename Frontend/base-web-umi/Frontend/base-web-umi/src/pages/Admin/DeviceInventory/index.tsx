import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Input, Button, Tag, Select, Space, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DeviceFormModal from './form';

const DeviceInventory: React.FC = () => {
  // Gọi các state và hàm xử lý từ Model
  const { devices, categories, loading, fetchDevices, handleDeleteDevice } = useModel('deviceInventory.deviceInventoryModel');
  
  const [searchText, setSearchText] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined); // ID danh mục chuyển thành số number
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<DeviceInventory.InventoryItem | null>(null);

  // Vừa vào trang là tự động load dữ liệu thiết bị kho từ DB Java
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  /**  Hàm kích hoạt lệnh tìm kiếm kết hợp cả keyword và bộ lọc local categoryId */
  const handleSearch = (keyword: string, categoryId?: number) => {
    fetchDevices({ keyword, categoryId });
  };

  const columns = [
    { 
      title: 'Mã', dataIndex: 'id', key: 'id', width: 100, align: 'center' as const 
    },
    { 
      title: 'Tên thiết bị', dataIndex: 'name', key: 'name',
      render: (text: string, record: DeviceInventory.InventoryItem) => (
        <Space size="middle">
          {/* Đổ chuẩn trường imageUrl từ Cloudinary Backend trả về */}
          <img 
            src={record.imageUrl || 'https://via.placeholder.com/40'} 
            alt={text} 
            style={{ width: 40, height: 40, borderRadius: '6px', objectFit: 'cover', border: '1px solid #f0f0f0' }} 
          />
          <b style={{ color: '#262626' }}>{text}</b>
        </Space>
      )
    },
    { 
      title: 'Danh mục', 
      dataIndex: 'category', 
      key: 'category', 
      align: 'center' as const,
      render: (category: DeviceInventory.InventoryItem['category']) => category?.name || 'Khác'
    },
    { 
      title: 'Số lượng', 
      dataIndex: 'quantity', 
      key: 'quantity', 
      align: 'center' as const 
    },
    { 
      title: 'Tình trạng', dataIndex: 'status', key: 'status', align: 'center' as const,
      render: (_: string, record: DeviceInventory.InventoryItem) => {
        return record.quantity > 0 
          ? <Tag color="success" style={{ borderRadius: '4px' }}>Còn hàng</Tag> 
          : <Tag color="error" style={{ borderRadius: '4px' }}>Hết hàng</Tag>;
      }
    },
    {
      title: 'Thao tác', key: 'action', align: 'center' as const, width: 120,
      render: (_: any, record: DeviceInventory.InventoryItem) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => { setSelectedRecord(record); setModalOpen(true); }} // Truyền record chuẩn vào Form Sửa
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thiết bị này khỏi kho không?"
            onConfirm={async () => {
              const success = await handleDeleteDevice(record.id);
              if (success) handleSearch(searchText, categoryFilter);
            }}
            okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      
      {/* TIÊU ĐỀ TRANG & NÚT THÊM */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: '20px', color: '#1f1f1f' }}> Quản lý kho thiết bị</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => { setSelectedRecord(null); setModalOpen(true); }}
          style={{ backgroundColor: '#43c223', borderColor: '#43c223', borderRadius: '8px', height: '36px', fontWeight: 500 }}
        >
          Thêm thiết bị
        </Button>

      </div>

      {/* THANH BỘ LỌC TÌM KIẾM */}
      <div className="customSearchBox" style={{ 
        backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', marginBottom: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', display: 'flex', gap: '16px', alignItems: 'center'
      }}>
        <Input
          placeholder="Tìm kiếm thiết bị..."
          allowClear 
          style={{ flex: 1, borderRadius: '8px' }}
          value={searchText}
          onChange={(e) => {
            const val = e.target.value;
            setSearchText(val);
            if (!val) handleSearch('', categoryFilter);
          }}
          onPressEnter={() => handleSearch(searchText, categoryFilter)}
          prefix={<SearchOutlined style={{ color: '#bfbfbf', marginRight: '4px' }} />}
        />
        <Select
          value={categoryFilter} 
          placeholder="Tất cả danh mục"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => {
            setCategoryFilter(value);
            handleSearch(searchText, value);
          }}
          dropdownStyle={{ borderRadius: '8px' }}
          options={categories}
        />
      </div>

      {/* BẢNG DỮ LIỆU CHÍNH */}
      <div style={{ 
        backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '12px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', overflow: 'hidden' 
      }}>
        <Table
          loading={loading}
          dataSource={devices}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10, locale: { items_per_page: '/ trang' } }}
        />
      </div>

      {/* KHUNG MODAL POPUP FORM */}
      <DeviceFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          handleSearch(searchText, categoryFilter);
        }}
        record={selectedRecord}
      />
    </div>
  );
};

export default DeviceInventory;