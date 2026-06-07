import React from 'react';
import { Form, Select, DatePicker, Button, Input, Space, Typography, Card } from 'antd';
import { MinusOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import moment from 'moment';
// Đường dẫn gọi hook dịch vụ kết nối Backend thật
import { useBorrowForm } from '../../../services/YeuCauMuon/useBorrowForm';

const { Title, Paragraph } = Typography;

const YeuCauMuonThietBi: React.FC = () => {
	const { form, submitting, deviceOptions, changeQuantity, handleSubmit, handleCancel } = useBorrowForm();

	return (
		<div
			style={{
				margin: '-24px -24px -24px -24px',
				padding: '32px 40px',
				minHeight: 'calc(100vh + 48px)',
				backgroundImage: `linear-gradient(to bottom, rgba(248, 250, 252, 0.6), rgba(248, 250, 252, 0.7)), url('https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundAttachment: 'fixed',
				boxSizing: 'border-box',
			}}
		>
			<div style={{ width: '100%' }}>
				<div style={{ marginBottom: '24px', textAlign: 'left' }}>
					<Title level={2} style={{ marginBottom: '4px' }}>
						Yêu cầu mượn thiết bị
					</Title>
					<Paragraph type='secondary'>Điền thông tin để gửi yêu cầu mượn thiết bị nhanh chóng</Paragraph>
				</div>

				{/* ✅ Khung bảng (Card) được giới hạn độ rộng và căn giữa bằng margin '0 auto' */}
				<Card
					style={{
						width: '100%',
						maxWidth: '560px',
						margin: '0 auto',
						borderRadius: '16px',
						boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
						border: 'none',
						background: '#ffffff',
					}}
					bodyStyle={{ padding: '32px' }}
				>
					<Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{ quantity: 1 }}>
						<Form.Item
							label={<span style={{ fontWeight: 600 }}>Chọn thiết bị</span>}
							name='deviceItemId'
							rules={[{ required: true, message: 'Vui lòng chọn thiết bị muốn mượn!' }]}
						>
							<Select placeholder='-- Chọn thiết bị --' size='large' style={{ borderRadius: '6px' }}>
								{deviceOptions.map((device) => (
									<Select.Option key={device.id} value={device.id}>
										{device.name} (Kho: {device.quantity ?? 0})
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
							<Form.Item label={<span style={{ fontWeight: 600 }}>Ngày mượn (Hôm nay)</span>}>
								<DatePicker
									defaultValue={moment()}
									disabled
									size='large'
									style={{ width: '100%', borderRadius: '6px', background: '#f5f5f5' }}
									format='MM/DD/YYYY'
								/>
							</Form.Item>

							<Form.Item
								label={<span style={{ fontWeight: 600 }}>Ngày trả dự kiến</span>}
								name='expectedReturnDate'
								rules={[
									{ required: true, message: 'Chọn ngày trả dự kiến!' },
									() => ({
										validator(_, value) {
											if (!value || value.isAfter(moment().endOf('day'))) {
												return Promise.resolve();
											}
											return Promise.reject(new Error('Ngày trả phải sau ngày hôm nay!'));
										},
									}),
								]}
							>
								<DatePicker
									placeholder='mm/dd/yyyy'
									size='large'
									style={{ width: '100%', borderRadius: '6px' }}
									format='MM/DD/YYYY'
									disabledDate={(current) => current && current < moment().endOf('day')}
								/>
							</Form.Item>
						</div>

						<Form.Item
							label={<span style={{ fontWeight: 600 }}>Số lượng</span>}
							name='quantity'
							rules={[{ required: true }]}
							style={{ marginBottom: '28px' }}
						>
							<Space>
								<Button
									icon={<MinusOutlined />}
									onClick={() => changeQuantity(-1)}
									style={{ borderRadius: '6px', height: '40px', width: '40px' }}
								/>
								<Form.Item name='quantity' noStyle>
									<Input
										readOnly
										style={{
											width: '60px',
											textAlign: 'center',
											height: '40px',
											borderRadius: '6px',
											fontWeight: 'bold',
										}}
									/>
								</Form.Item>
								<Button
									icon={<PlusOutlined />}
									onClick={() => changeQuantity(1)}
									style={{ borderRadius: '6px', height: '40px', width: '40px' }}
								/>
							</Space>
						</Form.Item>

						<Form.Item style={{ marginBottom: 0, marginTop: '16px' }}>
							<Space size='middle'>
								<Button
									type='primary'
									htmlType='submit'
									loading={submitting}
									icon={<SendOutlined />}
									style={{
										background: '#00b96b',
										borderColor: '#00b96b',
										height: '40px',
										padding: '0 24px',
										borderRadius: '6px',
										fontWeight: '600',
									}}
								>
									Gửi yêu cầu
								</Button>
								<Button
									onClick={handleCancel}
									style={{
										height: '40px',
										padding: '0 24px',
										borderRadius: '6px',
										color: '#64748b',
									}}
								>
									Hủy
								</Button>
							</Space>
						</Form.Item>
					</Form>
				</Card>
			</div>
		</div>
	);
};

export default YeuCauMuonThietBi;
