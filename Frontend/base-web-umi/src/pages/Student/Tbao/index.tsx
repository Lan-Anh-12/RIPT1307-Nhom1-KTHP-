import React from 'react';
import { Card, Typography, Space, Button, Spin } from 'antd';
import { CloseCircleFilled, ExclamationCircleFilled, InfoCircleFilled, CheckOutlined } from '@ant-design/icons';
// ĐÃ SỬA: Thay đổi đường dẫn import trỏ thẳng sang thư mục services tổng của dự án
import { useNotification } from '../../../services/Tbao/useNotification';

const { Title, Paragraph, Text } = Typography;

const ThongBaoCuaToi: React.FC = () => {
	const { activeTab, setActiveTab, stats, filteredNotifications, loading, handleMarkAsRead, handleMarkAllAsRead } =
		useNotification();

	// 🌟 ĐÃ SỬA: Khớp giá trị Enum chữ in hoa từ cơ sở dữ liệu Backend
	const renderIcon = (type?: string) => {
		switch (type) {
			case 'ERROR':
				return <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '20px', marginTop: '4px' }} />;
			case 'WARNING':
				return <ExclamationCircleFilled style={{ color: '#faad14', fontSize: '20px', marginTop: '4px' }} />;
			case 'INFO':
			default:
				return <InfoCircleFilled style={{ color: '#1890ff', fontSize: '20px', marginTop: '4px' }} />;
		}
	};

	return (
		<div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
			<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
				{/* Thanh tiêu đề trên cùng + Nút Đánh dấu tất cả đã đọc */}
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
					<div>
						<Title level={3} style={{ margin: 0, fontWeight: '700' }}>
							Thông báo của tôi
						</Title>
						<Paragraph type='secondary' style={{ margin: '4px 0 0 0' }}>
							Nhận cảnh báo từ hệ thống và quản trị viên
						</Paragraph>
					</div>

					{/* Nút Đánh dấu tất cả đã đọc */}
					{stats.unread > 0 && (
						<Button
							type='primary'
							icon={<CheckOutlined />}
							onClick={handleMarkAllAsRead}
							style={{ background: '#00b96b', borderColor: '#00b96b', borderRadius: '6px', fontWeight: 500 }}
						>
							Đánh dấu tất cả đã đọc
						</Button>
					)}
				</div>

				{/* Khối các thẻ bộ lọc số lượng */}
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
					{[
						{ key: 'all', label: 'Tất cả', count: stats.all, color: '#1e293b' },
						{ key: 'unread', label: 'Chưa đọc', count: stats.unread, color: '#dc2626' },
						{ key: 'read', label: 'Đã đọc', count: stats.read, color: '#1e293b' },
					].map((tab) => {
						const isSelected = activeTab === tab.key;
						return (
							<div
								key={tab.key}
								onClick={() => setActiveTab(tab.key as any)}
								style={{
									padding: '16px',
									background: '#ffffff',
									borderRadius: '8px',
									border: isSelected ? '1.5px solid #1e293b' : '1px solid #e2e8f0',
									cursor: 'pointer',
									transition: 'all 0.2s',
									boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
								}}
							>
								<Paragraph type='secondary' style={{ margin: 0, fontSize: '13px' }}>
									{tab.label}
								</Paragraph>
								<Title level={3} style={{ margin: '4px 0 0 0', fontWeight: '700', color: tab.color }}>
									{tab.count}
								</Title>
							</div>
						);
					})}
				</div>

				{/* Danh sách thông báo bọc trong Spin Loading */}
				<Spin spinning={loading}>
					<Space direction='vertical' size={16} style={{ width: '100%' }}>
						{filteredNotifications.map((notif) => (
							<Card
								key={notif.id}
								bodyStyle={{ padding: '20px' }}
								style={{
									borderRadius: '8px',
									border: '1px solid #e2e8f0',
									boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
									backgroundColor: notif.isRead ? '#ffffff' : '#f8fafc',
								}}
							>
								<div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
									{/* Icon bên trái */}
									{renderIcon(notif.type)}

									{/* Nội dung bên phải */}
									<div style={{ flex: 1 }}>
										{/* Tiêu đề + Dấu chấm đỏ chưa đọc */}
										<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
											<Text style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>{notif.title}</Text>
											{/* 🌟 ĐÃ SỬA: Chuyển sang thuộc tính isRead */}
											{!notif.isRead && (
												<span
													style={{
														width: '6px',
														height: '6px',
														background: '#ff4d4f',
														borderRadius: '50%',
														display: 'inline-block',
													}}
												/>
											)}
										</div>

										{/* Nội dung text thông báo */}
										<Paragraph style={{ color: '#475569', margin: '0 0 12px 0', lineHeight: '1.6' }}>
											{notif.content}
										</Paragraph>

										{/* Chân thẻ: hiển thị thời gian và tương tác */}
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<Space size='middle' style={{ fontSize: '12px', color: '#94a3b8' }}>
												<span>Hệ thống</span>
												{/* 🌟 ĐÃ SỬA: Chuyển sang thuộc tính createdAt */}
												<span>{notif.createdAt}</span>
											</Space>

											{/* 🌟 ĐÃ SỬA: Chỉ hiển thị nút nếu thuộc tính isRead bằng false */}
											{!notif.isRead && (
												<span
													onClick={() => handleMarkAsRead(notif.id)}
													style={{
														fontSize: '13px',
														color: '#1e293b',
														fontWeight: '500',
														textDecoration: 'underline',
														cursor: 'pointer',
													}}
												>
													Đánh dấu đã đọc
												</span>
											)}
										</div>
									</div>
								</div>
							</Card>
						))}

						{/* Trạng thái danh sách rỗng */}
						{filteredNotifications.length === 0 && (
							<Card style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', borderRadius: '8px' }}>
								Không có thông báo nào trong mục này.
							</Card>
						)}
					</Space>
				</Spin>
			</div>
		</div>
	);
};

export default ThongBaoCuaToi;
