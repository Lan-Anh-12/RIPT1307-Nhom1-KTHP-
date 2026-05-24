import React from 'react';
import { Input, Button, Card, Row, Col, Badge, Space, Typography, Spin, Modal } from 'antd';
import { SearchOutlined, InfoCircleOutlined, SolutionOutlined } from '@ant-design/icons';
// Gọi "nhân viên xử lý logic" từ file bên cạnh vào
import { useDeviceFilter } from '../../services/DanhSachThietBi/useDeviceFilter';
import DeviceDetailModal from './DeviceDetailModal'; // <--- Thêm dòng này
import { history } from 'umi'; // Thư viện điều hướng chuyển trang của Ant Design Pro

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

const DanhSachThietBi = () => {
	// 🌟 ĐÃ SỬA: Bóc tách thêm các biến quản lý Popup từ Hook vừa sửa xong
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
		<div style={{ padding: '24px', minHeight: '100vh' }}>
			{/* Tiêu đề trang */}
			<div style={{ marginBottom: '24px' }}>
				<Title level={2} style={{ marginBottom: '4px' }}>
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
					boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
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
						devices.map((device: any) => (
							<Col xs={24} sm={12} md={8} key={device.id}>
								<Card
									hoverable
									// 🌟 ĐÃ THÊM: Click vào bất kỳ vùng nào trên Card sẽ mở Popup chi tiết sản phẩm
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
												src={device.image}
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
											count={device.status}
											style={{
												backgroundColor: device.statusType === 'success' ? '#e6f7ff' : '#fff7e6',
												color: device.statusType === 'success' ? '#1890ff' : '#fa8c16',
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
											Tồn kho:{' '}
											<Text strong style={{ color: device.stock.startsWith('0') ? '#ff4d4f' : '#1890ff' }}>
												{device.stock}
											</Text>
										</Text>
									</div>
								</Card>
							</Col>
						))
					) : (
						<Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
							<Text type='secondary' style={{ fontSize: '16px' }}>
								Không tìm thấy thiết bị phù hợp!
							</Text>
						</Col>
					)}
				</Row>
			)}

			{/* ======================================================= */}
			{/* 🌟 ĐÃ THÊM: POPUP MODAL HIỂN THỊ CHI TIẾT THEO SƠ ĐỒ */}
			{/* ======================================================= */}
			<DeviceDetailModal isOpen={isModalOpen} device={selectedDevice} onClose={closeDetailModal} />
		</div>
	);
};

export default DanhSachThietBi;
