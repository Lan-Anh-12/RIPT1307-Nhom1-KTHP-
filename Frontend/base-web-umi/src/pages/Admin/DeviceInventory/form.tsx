import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Modal, Form, Input, InputNumber, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface DeviceFormModalProps {
  open: boolean;
  onClose: () => void;
  record?: DeviceInventory.InventoryItem | null;
}

const DeviceFormModal: React.FC<DeviceFormModalProps> = ({ open, onClose, record }) => {
  const [form] = Form.useForm();
  const { handleAddDevice, handleUpdateDevice, categories } = useModel('deviceInventory.deviceInventoryModel');
  const isEdit = !!record; 

  useEffect(() => {
    if (open) {
      if (record) {
        form.setFieldsValue({
          name: record.name,
          categoryId: record.category?.id || record.categoryId, // Bốc ID từ object danh mục lồng nhau
          stock: record.quantity,                                // Bốc trường quantity từ DB đổ vào ô nhập stock
          description: record.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); 
      let success = false;
      
      if (isEdit && record) {
        success = await handleUpdateDevice(record.id, values, record.imageUrl);
      } else {
        success = await handleAddDevice(values);
      }

      if (success) onClose();
    } catch (error) {
      console.log('Validate lỗi:', error);
    }
  };

  return (
    <Modal
      title={<b style={{ fontSize: '18px' }}>{isEdit ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}</b>}
      visible={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Xác nhận"
      cancelText="Hủy"
      width={540}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
        <span style={{lineHeight: '32px'}}>
          Hình ảnh thiết bị
        </span>
        <Form.Item name="imageFile" style={{ margin: 0, display: 'inline-block' , transform: 'translateY(4px)'}}>
          <Upload maxCount={1} beforeUpload={() => false} listType="picture">
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