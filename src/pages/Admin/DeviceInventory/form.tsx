import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Modal, Form, Input, InputNumber, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface DeviceFormModalProps {
  open: boolean;
  onClose: (needRefresh?: any) => void; 
  record?: DeviceInventory.InventoryItem | null;
}

const DeviceFormModal: React.FC<DeviceFormModalProps> = ({ open, onClose, record }) => {
  const [form] = Form.useForm();
  const { handleAddDevice, handleUpdateDevice, categories } = useModel('deviceInventory.deviceInventoryModel');
  const isEdit = !!record; 

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (open) {
      if (record) {
        // Đổ dữ liệu chữ vào Form
        form.setFieldsValue({
          name: record.name,
          categoryId: record.category?.id || record.categoryId, 
          stock: record.quantity,                                
          description: record.description,
        });

        // Đổ ảnh của chính thiết bị đang chọn vào ô Upload
        if (record.imageUrl) {
          setFileList([
            {
              uid: '-1',
              name: 'Hình ảnh thiết bị hiện tại',
              status: 'done',
              url: record.imageUrl,
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        // Form thêm mới: Dọn dẹp sạch sẽ toàn bộ chữ lẫn file ảnh
        form.resetFields();
        setFileList([]);
      }
    }
  }, [open, record, form]);

  // Hàm lắng nghe sự thay đổi của file ảnh khi người dùng bấm chọn file mới hoặc xóa file
  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); 
      onClose(true);
      let success = false;
      
      if (isEdit && record) {
        success = await handleUpdateDevice(record.id, values, record.imageUrl);
      } else {
        success = await handleAddDevice(values);
      }

      if (success) {
        // Đóng modal và dọn sạch file list
        setFileList([]);
        onClose();
      }
    } catch (error) {
      console.log('Validate lỗi:', error);
    }
  };

  const handleCancel = () => {
    setFileList([]); // Clear file list khi người dùng nhấn Hủy hoặc Đóng
    onClose();
  };

  return (
    <Modal
      title={<b style={{ fontSize: '18px' }}>{isEdit ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}</b>}
      visible={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Xác nhận"
      cancelText="Hủy"
      width={540}
      destroyOnClose //  hủy các DOM cũ của modal khi đóng để làm sạch hoàn toàn dữ liệu
    >
      <Form form={form} layout="vertical" initialValues={{ stock: 1 }}>
        {/* Ô NHẬP TÊN */}
        <Form.Item label="Tên thiết bị" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input placeholder="Ví dụ: Máy chiếu Epson EB-X51" style={{ borderRadius: '8px' }} />
        </Form.Item>

        {/* Ô CHỌN DANH MỤC CỐ ĐỊNH THEO ID SỐ CỦA DB */}
        <Form.Item label="Danh mục thiết bị" name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
          <Select placeholder="Chọn danh mục" style={{ borderRadius: '8px' }} options={categories} />
        </Form.Item>

        {/* Ô NHẬP SỐ LƯỢNG */}
        <Form.Item label="Số lượng tồn kho" name="stock" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
          <InputNumber min={0} style={{ width: '100%', borderRadius: '8px' }} />
        </Form.Item>
        
        {/* TẢI ẢNH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ lineHeight: '32px' }}>
            Hình ảnh thiết bị
          </span>
          <Form.Item name="imageFile" style={{ margin: 0, display: 'inline-block' }}>
            <Upload 
              maxCount={1} 
              beforeUpload={() => false} 
              listType="picture"
              fileList={fileList} //  Đồng bộ chặt chẽ danh sách file với State kiểm soát
              onChange={handleUploadChange} 
            >
              <Button icon={<UploadOutlined />} style={{ borderRadius: '6px' }}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </div>

        {/* Ô NHẬP MÔ TẢ */}
        <Form.Item label="Mô tả chi tiết" name="description">
          <Input.TextArea rows={3} placeholder="Nhập thông số kỹ thuật..." style={{ borderRadius: '8px' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeviceFormModal;