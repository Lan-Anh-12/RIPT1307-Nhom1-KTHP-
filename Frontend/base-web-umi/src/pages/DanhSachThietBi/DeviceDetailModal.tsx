// src/pages/DanhSachThietBi/DeviceDetailModal.tsx
import React from 'react';
import { Modal, Button, Typography, Space, Badge } from 'antd';
import { InfoCircleOutlined, SolutionOutlined } from '@ant-design/icons';
import { history } from 'umi';

const { Title, Paragraph, Text } = Typography;

// Định nghĩa các "đầu vào" (Props) mà Component này cần trang chính truyền cho
interface DeviceDetailModalProps {
	isOpen: boolean; // Trạng thái đóng/mở popup
	device: any; // Dữ liệu của thiết bị đang chọn
	onClose: () => void; // Hàm xử lý khi bấm đóng popup
}

const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ isOpen, device, onClose }) => {
	// Nếu chưa có thiết bị nào được chọn thì không hiển thị gì cả
	if (!device) return null;

	return (
		<Modal
			title={
				<Space>
					<InfoCircleOutlined style={{ color: '#1890ff' }} />
					<Text strong style={{ fontSize: '16px' }}>
						Chi tiết thiết bị chuyên sâu
					</Text>
				</Space>
			}
			visible={isOpen}
			onCancel={onClose}
			footer={null} // Tự custom nút mượn riêng bên dưới
			width={500}
			centered
		>
			<div>
				{/* Ảnh phóng to */}
				<div
					style={{
						background: '#f5f5f5',
						borderRadius: '12px',
						padding: '16px',
						display: 'flex',
						justifyContent: 'center',
						marginBottom: '16px',
					}}
				>
					<img
						src={device.image}
						alt={device.name}
						style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
					/>
				</div>

				{/* Tên & Thông tin cơ bản */}
				<Title level={4} style={{ marginBottom: '8px' }}>
					{device.name}
				</Title>
				<Space style={{ marginBottom: '16px' }} size='middle'>
					<Badge status={device.statusType} text={device.status} />
					<Text type='secondary'>|</Text>
					<Text type='secondary'>
						Danh mục: <Text strong>{device.category}</Text>
					</Text>
				</Space>

				{/* Mô tả sản phẩm */}
				<div style={{ background: '#f9f9f9', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
					<Text strong style={{ display: 'block', marginBottom: '4px' }}>
						Mô tả sản phẩm:
					</Text>
					<Paragraph style={{ margin: 0, color: '#595959' }}>{device.description}</Paragraph>
				</div>

				{/* Nút mượn thiết bị */}
				<Button
					type='primary'
					icon={<SolutionOutlined />}
					size='large'
					block
					style={{
						background: '#00b96b',
						borderColor: '#00b96b',
						height: '45px',
						borderRadius: '8px',
						fontWeight: '600',
					}}
					onClick={() => {
						onClose(); // Đóng popup
						history.push(`/yeu-cau-muon?deviceId=${device.id}`); // Điều hướng
					}}
				>
					Đăng ký mượn thiết bị này
				</Button>
			</div>
		</Modal>
	);
};

export default DeviceDetailModal;
