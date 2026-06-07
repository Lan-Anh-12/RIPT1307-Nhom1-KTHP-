import React from 'react';
import { Modal, Button, Image, Typography, Space, Badge } from 'antd';
import { InfoCircleOutlined, SolutionOutlined } from '@ant-design/icons';
import { history } from 'umi';
import type { DeviceType } from '../../../services/DanhSachThietBi/typing';

const { Title, Paragraph, Text } = Typography;

interface DeviceDetailModalProps {
	isOpen: boolean;
	device: DeviceType | null;
	onClose: () => void;
}

const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ isOpen, device, onClose }) => {
	if (!device) return null;

	const getStatusDisplay = (status?: string) => {
		switch (status?.toUpperCase()) {
			case 'AVAILABLE':
				return { text: 'Còn hàng', statusType: 'success' as const };
			case 'BORROWED':
				return { text: 'Đang được mượn', statusType: 'error' as const };
			case 'MAINTENANCE':
				return { text: 'Bảo trì', statusType: 'warning' as const };
			default:
				return { text: status || 'Không rõ', statusType: 'default' as const };
		}
	};

	const statusConfig = getStatusDisplay(device.status);

	return (
		<Modal
			title={
				<Space>
					<InfoCircleOutlined style={{ color: '#1890ff' }} />
					<Text strong style={{ fontSize: '16px' }}>
						Chi tiết thiết bị
					</Text>
				</Space>
			}
			visible={isOpen}
			onCancel={onClose}
			footer={null}
			width={500}
			centered
		>
			<div>
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
						src={device.imageUrl}
						alt={device.name}
						style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
						onError={(e) => {
							e.currentTarget.src = 'https://gw.alipayobjects.com/zos/rmsportal/JiqGscbAOlBsTlqOMfCb.png';
						}}
					/>
				</div>

				{/* Tên & Thông tin cơ bản */}
				<Title level={4} style={{ marginBottom: '8px' }}>
					{device.name}
				</Title>
				<Space style={{ marginBottom: '16px' }} size='middle'>
					<Badge status={statusConfig.statusType} text={statusConfig.text} />
					<Text type='secondary'>|</Text>
					<Text type='secondary'>
						Danh mục: <Text strong>{device.category}</Text>
					</Text>
					<Text type='secondary'>|</Text>
					<Text type='secondary'>
						Số lượng: <Text strong>{device.quantity ?? 0}</Text>
					</Text>
				</Space>

				{/* Mô tả sản phẩm */}
				<div style={{ background: '#f9f9f9', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
					<Text strong style={{ display: 'block', marginBottom: '4px' }}>
						Mô tả sản phẩm:
					</Text>
					<Paragraph style={{ margin: 0, color: '#595959' }}>
						{device.description || 'Chưa có mô tả chi tiết cho thiết bị này.'}
					</Paragraph>
				</div>

				{/* Nút mượn thiết bị */}
				<Button
					type='primary'
					icon={<SolutionOutlined />}
					size='large'
					block
					disabled={device.status?.toUpperCase() !== 'AVAILABLE'}
					style={{
						background: device.status?.toUpperCase() === 'AVAILABLE' ? '#00b96b' : '#d9d9d9',
						borderColor: device.status?.toUpperCase() === 'AVAILABLE' ? '#00b96b' : '#d9d9d9',
						height: '45px',
						borderRadius: '8px',
						fontWeight: '600',
					}}
					onClick={() => {
						onClose();
						history.push(`/student/yeu-cau-muon?deviceId=${device.id}`);
					}}
				>
					{device.status?.toUpperCase() === 'AVAILABLE'
						? 'Đăng ký mượn thiết bị này'
						: 'Không thể mượn tại thời điểm này'}
				</Button>
			</div>
		</Modal>
	);
};

export default DeviceDetailModal;
