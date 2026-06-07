import React from 'react';
import { Input, Button, Card, Row, Col, Badge, Space, Typography, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDeviceFilter } from '../../../services/DanhSachThietBi/useDeviceFilter';
import DeviceDetailModal from './DeviceDetailModal';
import type { DeviceType } from '../../../services/DanhSachThietBi/typing';

const { Title, Paragraph, Text } = Typography;

const categories = [
	'Tất cả',
	'Máy chiếu',
	'Laptop',
	'Âm thanh',
	'Màn hình',
	'Bảng tương tác',
	'Máy quay',
	'Máy in',
	'Bộ đàm',
	'Mạng',
];

// Hàm bổ trợ chuyển đổi từ Trạng thái Backend sang Màu sắc & Nhãn tiếng Việt hiển thị
const getStatusDisplay = (status: string, quantity: number) => {
	if (quantity <= 0 || status === 'UNAVAILABLE') {
		return { text: 'Hết hàng', color: '#ff4d4f', bg: '#fff1f0' };
	}
	switch (status) {
		case 'AVAILABLE':
			return { text: 'Sẵn sàng mượn', color: '#52c41a', bg: '#f6ffed' };
		case 'BORROWED':
			return { text: 'Đang cho mượn', color: '#fa8c16', bg: '#fff7e6' };
		default:
			return { text: status || 'Sẵn sàng', color: '#1890ff', bg: '#e6f7ff' };
	}
};

const DanhSachThietBi: React.FC = () => {
	const {
		selectedCategory,
		setSelectedCategory,
		searchText,
		setSearchText,
		devices,
		loading,
		isModalOpen,
		selectedDevice,
		openDetailModal,
		closeDetailModal,
	} = useDeviceFilter();

	return (
		<div
			style={{
				padding: '24px',
				minHeight: '100vh',
				// 🌟 THÊM LỚP NỀN GRADIENT: Loang dịu mắt từ xanh nhạt sang trắng xám
				background: 'linear-gradient(135deg, #f4f7f6 0%, #f0f2f5 100%)',
			}}
		>
			{/* Tiêu đề trang */}
			<div style={{ marginBottom: '24px' }}>
				<Title level={2} style={{ marginBottom: '4px', color: '#1a1a1a' }}>
					Danh sách thiết bị
				</Title>
				<Paragraph type='secondary'>Xem thông tin và tình trạng các thiết bị có thể mượn</Paragraph>
			</div>

			{/* Thanh Tìm kiếm & Bộ lọc Categories */}
			<div
				style={{
					background: '#fff',
					padding: '16px',
					borderRadius: '12px',
					marginBottom: '24px',
					boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
				}}
			>
				<Space size={[8, 12]} wrap>
					<Input
						placeholder='Tìm kiếm thiết bị...'
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
						style={{ width: 240, borderRadius: '8px' }}
						allowClear
					/>

					{categories.map((cat) => (
						<Button
							key={cat}
							type={selectedCategory === cat ? 'primary' : 'text'}
							style={{
								borderRadius: '8px',
								background: selectedCategory === cat ? '#00b96b' : '#f0f2f5',
								color: selectedCategory === cat ? '#fff' : '#434343',
								fontWeight: selectedCategory === cat ? '600' : 'normal',
							}}
							onClick={() => setSelectedCategory(cat)}
						>
							{cat}
						</Button>
					))}
				</Space>
			</div>

			{/* Lưới danh sách thẻ Thiết bị hoặc Vòng xoay Loading */}
			{loading ? (
				<div style={{ textAlign: 'center', padding: '100px 0' }}>
					<Spin size='large' tip='Đang tải danh sách thiết bị...' />
				</div>
			) : (
				<Row gutter={[24, 24]}>
					{devices.length > 0 ? (
						devices.map((device: DeviceType) => {
							// Lấy cấu hình màu sắc tương ứng trạng thái thực tế từ Backend
							const statusConfig = getStatusDisplay(device.status, device.quantity);

							return (
								<Col xs={24} sm={12} md={8} key={device.id}>
									<Card
										hoverable
										onClick={() => openDetailModal(device)}
										style={{
											borderRadius: '16px',
											overflow: 'hidden',
											border: 'none',
											boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
										}}
										bodyStyle={{ padding: '16px' }}
										cover={
											<div
												style={{
													height: '200px',
													overflow: 'hidden',
													background: '#fafafa',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<img
													alt={device.name}
													src={device.imageUrl || 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'} // 🌟 ĐÃ SỬA: Map chuẩn camelCase từ Backend
													style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
												/>
											</div>
										}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'flex-start',
												marginBottom: '8px',
											}}
										>
											<Title level={5} style={{ margin: 0, fontSize: '15px', flex: 1, paddingRight: '8px' }}>
												{device.name}
											</Title>
											<Badge
												count={statusConfig.text} // 🌟 ĐÃ SỬA: Chuyển text hiển thị sang Tiếng Việt
												style={{
													backgroundColor: statusConfig.bg,
													color: statusConfig.color,
													boxShadow: 'none',
													borderRadius: '4px',
													padding: '0 8px',
													height: '22px',
													lineHeight: '22px',
												}}
											/>
										</div>

										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												paddingTop: '12px',
												borderTop: '1px solid #f0f0f0',
											}}
										>
											<Text type='secondary' style={{ fontSize: '13px' }}>
												Mã:{' '}
												<Text strong style={{ color: '#434343' }}>
													{device.id}
												</Text>
											</Text>
											<Text type='secondary' style={{ fontSize: '13px' }}>
												Tồn kho: {/* 🌟 ĐÃ SỬA: Khớp chuẩn trường dữ liệu device.quantity */}
												<Text strong style={{ color: device.quantity === 0 ? '#ff4d4f' : '#1890ff' }}>
													{device.quantity}
												</Text>
											</Text>
										</div>
									</Card>
								</Col>
							);
						})
					) : (
						<Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
							<Text type='secondary' style={{ fontSize: '16px' }}>
								Không tìm thấy thiết bị phù hợp!
							</Text>
						</Col>
					)}
				</Row>
			)}

			{/* POPUP MODAL HIỂN THỊ CHI TIẾT THEO SƠ ĐỒ ĐÃ ĐỒNG BỘ TYPE */}
			<DeviceDetailModal isOpen={isModalOpen} device={selectedDevice} onClose={closeDetailModal} />
		</div>
	);
};

export default DanhSachThietBi;
