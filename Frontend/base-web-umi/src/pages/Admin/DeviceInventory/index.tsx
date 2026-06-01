import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Input, Button, Tag, Select, Space, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DeviceFormModal from './form';

const DeviceInventory: React.FC = () => {
  // Gọi "bộ não" xử lý kho thiết bị từ Model (Sử dụng đúng namespace định danh của bạn)
  const { devices, loading, fetchDevices, handleDeleteDevice } = useModel('deviceInventory.deviceInventoryModel');
  
  const [searchText, setSearchText] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL'); // Quản lý state danh mục để làm bộ lọc liên đới
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<DeviceInventory.InventoryItem | null>(null);

  // Vừa vào trang là tự động load dữ liệu
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  /** 🔄 Hàm kích hoạt lệnh tìm kiếm kết hợp nghiêm ngặt cả 2 bộ lọc cùng lúc */
  const handleSearch = (keyword: string, category: string) => {
    fetchDevices({ keyword, category });
  };

  const columns = [
    { 
      title: 'Mã', dataIndex: 'id', key: 'id', width: 100, align: 'center' as const 
    },
    { 
      title: 'Tên thiết bị', dataIndex: 'name', key: 'name',
      render: (text: string, record: DeviceInventory.InventoryItem) => (
        <Space size="middle">
          {/* Đổ link ảnh lấy từ Cloudinary ra đây */}
          <img 
            src={record.image || 'https://via.placeholder.com/40'} 
            alt={text} 
            style={{ width: 40, height: 40, borderRadius: '6px', objectFit: 'cover', border: '1px solid #f0f0f0' }} 
          />
          <b style={{ color: '#262626' }}>{text}</b>
        </Space>
      )
    },
    { 
      title: 'Danh mục', dataIndex: 'category', key: 'category', align: 'center' as const 
    },
    { 
      title: 'Tồn kho', dataIndex: 'stock', key: 'stock', align: 'center' as const 
    },
    { 
      title: 'Tình trạng', dataIndex: 'status', key: 'status', align: 'center' as const,
      render: (status: string, record: DeviceInventory.InventoryItem) => {
        // Tự động hóa trạng thái tag hiển thị dựa trên số lượng tồn kho thực tế
        const isAvailable = record.stock > 0 && status === 'con_hang';
        return isAvailable 
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
            onClick={() => { setSelectedRecord(record); setModalOpen(true); }} // Mở form sửa và truyền dữ liệu dòng hiện tại vào
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thiết bị này khỏi kho không?"
            onConfirm={async () => {
              const success = await handleDeleteDevice(record.id);
              // Sau khi xóa thành công, tự động cập nhật lại bảng theo bộ lọc đang chọn hiện tại
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
      
      {/* TIÊU ĐỀ TRANG & NÚT THÊM CHUẨN ĐỎ ĐẬM PTIT */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: '20px', color: '#1f1f1f' }}>
          Quản lý kho thiết bị
        </h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => { setSelectedRecord(null); setModalOpen(true); }} // Truyền null để hiểu là Thêm mới tinh
          style={{ backgroundColor: '#b30000', borderColor: '#b30000', borderRadius: '8px', height: '36px', fontWeight: 500 }}
        >
          Thêm thiết bị
        </Button>
      </div>

      <div className="customSearchBox" style={{ 
        backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', marginBottom: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', display: 'flex', gap: '16px', alignItems: 'center'
      }}>
        <Input
          placeholder="Tìm kiếm thiết bị..."
          allowClear 
          style={{ flex: 1 }}
          value={searchText}
          onChange={(e) => {
            const val = e.target.value;
            setSearchText(val);
            // Nếu xóa sạch chữ ô tìm kiếm, tự động kích hoạt lọc lại theo danh mục đang chọn hiện hành
            if (!val) handleSearch('', categoryFilter);
          }}
          onPressEnter={() => handleSearch(searchText, categoryFilter)} // Bấm Enter kích hoạt lọc song song
          prefix={<SearchOutlined style={{ color: '#bfbfbf', marginRight: '4px' }} />}
        />
        <Select
          value={categoryFilter} 
          style={{ width: 180 , borderRadius: '8px'}}
          onChange={(value) => {
            setCategoryFilter(value);
            // CHÌA KHÓA: Khi chuyển danh mục, bốc cả từ khóa đang gõ đi lọc liên đới nghiêm ngặt
            handleSearch(searchText, value);
          }}
          dropdownStyle={{ borderRadius: '8px' }}
          options={[
            { value: 'ALL', label: 'Tất cả danh mục' },
            { value: 'Máy chiếu', label: 'Máy chiếu' },
            { value: 'Micro', label: 'Micro' },
            { value: 'Khác', label: 'Khác' },
          ]}
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

      {/* KHUNG MODAL POPUP FORM (Giữ nguyên cấu trúc file form riêng biệt của bạn) */}
      <DeviceFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // Sau khi đóng modal (Thêm/Sửa thành công), làm tươi (refresh) lại bảng dữ liệu theo bộ lọc hiện hành
          handleSearch(searchText, categoryFilter);
        }}
        record={selectedRecord}
      />
    </div>
  );
};

export default DeviceInventory;