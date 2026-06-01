import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Space,Modal, Form, Input, InputNumber, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface DeviceFormModalProps {
  open: boolean;
  onClose: () => void;
  record?: DeviceInventory.InventoryItem | null;
}

const DeviceFormModal: React.FC<DeviceFormModalProps> = ({ open, onClose, record }) => {
  const [form] = Form.useForm();
  const { handleAddDevice, handleUpdateDevice } = useModel('deviceInventory.deviceInventoryModel');
  const isEdit = !!record; // Đổi sang kiểu boolean để kiểm tra xem đang là chế độ Sửa hay Thêm mới

  // Lắng nghe sự kiện mở Modal. Nếu sửa thì đổ dữ liệu cũ vào, nếu thêm mới thì xóa trống form.
  useEffect(() => {
    if (open) {
      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
  }, [open, record, form]);

  // Click nút Xác nhận ở Modal
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // Kiểm tra xem người dùng đã điền đủ các ô bắt buộc chưa
      let success = false;
      
      if (isEdit && record) {
        // Nếu là sửa: Truyền thêm link ảnh cũ (record.image) đề phòng người dùng giữ nguyên ảnh cũ không đổi
        success = await handleUpdateDevice(record.id, values, record.image);
      } else {
        success = await handleAddDevice(values);
      }

      if (success) {
        onClose(); // Lưu thành công thì đóng popup lại
      }
    } catch (error) {
      console.log('Validate form lỗi:', error);
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
      bodyStyle={{ padding: '24px 32px' }}
    >
      <Form form={form} layout="vertical" initialValues={{ status: 'con_hang', stock: 1, total: 1 }}>
        
        {/* TÊN THIẾT BỊ */}
        <Form.Item label="Tên thiết bị" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}>
          <Input placeholder="Ví dụ: Máy chiếu Epson EB-X51" style={{ borderRadius: '8px' }} />
        </Form.Item>

        {/* DANH MỤC */}
        <Form.Item label="Danh mục thiết bị" name="category" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
          <Select 
            placeholder="Chọn danh mục" style={{ borderRadius: '8px' }} dropdownStyle={{ borderRadius: '8px' }}
            options={[
              { value: 'Máy chiếu', label: 'Máy chiếu' },
              { value: 'Micro', label: 'Micro' },
              { value: 'Khác', label: 'Khác' },

            ]}
          />
        </Form.Item>

        {/* KHỐI SỐ LƯỢNG (Xếp song song trên 1 hàng ngang) */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item label="Số lượng tồn kho" name="stock" rules={[{ required: true, message: 'Nhập số lượng tồn!' }]} style={{ flex: 1 }}>
            <InputNumber min={0} style={{ width: '100%', borderRadius: '8px' }} />
          </Form.Item>
        </div>

        {/* TÌNH TRẠNG */}
        <Form.Item label="Tình trạng" name="status">
          <Select style={{ borderRadius: '8px' }} dropdownStyle={{ borderRadius: '8px' }} options={[
            { value: 'con_hang', label: 'Còn hàng' },
            { value: 'het_hang', label: 'Hết hàng' },
          ]} />
        </Form.Item>

        {/* NÚT TẢI ẢNH */}
        <Form.Item name="imageFile" style={{ marginBottom: '24px' }}>
          <Space size="middle" align="center">
            <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '14px' }}>Hình ảnh thiết bị</span>
            <Upload maxCount={1} beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />} style={{ borderRadius: '20px' }} />
            </Upload>
          </Space>
        </Form.Item>

        {/* MÔ TẢ CHI TIẾT */}
        <Form.Item label="Mô tả chi tiết" name="description">
          <Input.TextArea rows={3} placeholder="Nhập thông số kỹ thuật, ghi chú phòng học..." style={{ borderRadius: '8px' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeviceFormModal;