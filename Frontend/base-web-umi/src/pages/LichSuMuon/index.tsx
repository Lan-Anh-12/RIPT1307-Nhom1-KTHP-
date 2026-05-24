// src/pages/LichSuMuon/index.tsx
import React from 'react';
import { Input, Select, Card, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useBorrowHistory } from '../../services/LichSuMuon/useBorrowHistory'; // <--- Gọi "nhân viên xử lý logic" từ file bên cạnh vào
import HistoryTable from './HistoryTable'; // <--- 1. Thêm dòng IMPORT bảng này vào

const { Title, Paragraph } = Typography;

const LichSuMuonThietBi = () => {
	const { searchText, setSearchText, statusFilter, setStatusFilter, stats, filteredData, handleCancelRequest } =
		useBorrowHistory();

	return (
		<div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
			<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
				{/* Tiêu đề trang */}
				<div style={{ marginBottom: '24px' }}>
					<Title level={2} style={{ marginBottom: '4px' }}>
						Lịch sử mượn thiết bị
					</Title>
					<Paragraph type='secondary'>Xem lại các yêu cầu mượn thiết bị của bạn</Paragraph>
				</div>

				{/* Khối các thẻ thống kê trạng thái (Top Stats) */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
						gap: '16px',
						marginBottom: '24px',
					}}
				>
					{[
						{ label: 'Chờ duyệt', count: stats.pending },
						{ label: 'Đã duyệt', count: stats.approved },
						{ label: 'Từ chối', count: stats.rejected },
						{ label: 'Đã trả', count: stats.returned },
						{ label: 'Quá hạn', count: stats.overdue },
					].map((item, index) => (
						<Card
							key={index}
							bodyStyle={{ padding: '16px' }}
							style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
						>
							<Paragraph type='secondary' style={{ margin: 0, fontSize: '13px' }}>
								{item.label}
							</Paragraph>
							<Title level={3} style={{ margin: '4px 0 0 0', fontWeight: '700' }}>
								{item.count}
							</Title>
						</Card>
					))}
				</div>

				{/* Khung chứa Thanh tìm kiếm và Bảng dữ liệu */}
				<Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} bodyStyle={{ padding: '20px' }}>
					{/* Thanh tìm kiếm và Bộ lọc */}
					<div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
						<Input
							placeholder='Tìm kiếm theo tên thiết bị hoặc mã yêu cầu...'
							prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={{ flex: 1, borderRadius: '6px' }}
							allowClear
						/>
						<Select
							value={statusFilter}
							onChange={(value) => setStatusFilter(value)}
							style={{ width: 140 }}
							options={[
								{ value: 'Tất cả', label: 'Tất cả' },
								{ value: 'Chờ duyệt', label: 'Chờ duyệt' },
								{ value: 'Đã duyệt', label: 'Đã duyệt' },
								{ value: 'Từ chối', label: 'Từ chối' },
								{ value: 'Đã trả', label: 'Đã trả' },
								{ value: 'Quá hạn', label: 'Quá hạn' },
							]}
						/>
					</div>

					{/* 2. THAY THẾ KHỐI TABLE CŨ BẰNG ĐOẠN ĐƯỢC BÓC TÁCH NÀY */}
					<HistoryTable dataSource={filteredData} onCancel={handleCancelRequest} />
				</Card>
			</div>
		</div>
	);
};

export default LichSuMuonThietBi;
