import React from 'react';
import { Form, Select, DatePicker, Button, Input, Space, Typography, Card } from 'antd';
import { MinusOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import moment from 'moment';
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
				backgroundImage: `linear-gradient(to bottom, rgba(248, 250, 252, 0.6), rgba(248, 250, 252, 0.7)), url('https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1170&auto=format&fit=crop')`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundAttachment: 'fixed',
			}}
		>
			<div style={{ maxWidth: '560px', margin: '0 auto' }}>
				<div style={{ marginBottom: '24px', textAlign: 'left' }}>
					<Title level={2} style={{ marginBottom: '4px' }}>
						Yêu cầu mượn thiết bị
					</Title>
					<Paragraph type='secondary'>Điền thông tin để gửi yêu cầu mượn thiết bị nhanh chóng</Paragraph>
				</div>

				<Card
					style={{ borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: 'none' }}
					bodyStyle={{ padding: '32px' }}
				>
					<Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{ quantity: 1 }}>
						<Form.Item
							label={<span style={{ fontWeight: 600 }}>Chọn thiết bị</span>}
							name='deviceItemId'
							rules={[{ required: true, message: 'Vui lòng chọn thiết bị!' }]}
						>
							<Select placeholder='-- Chọn thiết bị --' size='large'>
								{deviceOptions.map((device) => (
									<Select.Option key={device.id} value={device.id}>
										{device.name} (Kho: {device.quantity ?? 0})
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
							<Form.Item
								label={<span style={{ fontWeight: 600 }}>Ngày mượn</span>}
								name='requestDate'
								rules={[{ required: true, message: 'Chọn ngày mượn!' }]}
							>
								<DatePicker style={{ width: '100%' }} size='large' format='MM/DD/YYYY' />
							</Form.Item>

							<Form.Item
								label={<span style={{ fontWeight: 600 }}>Ngày trả dự kiến</span>}
								name='expectedReturnDate'
								rules={[{ required: true, message: 'Chọn ngày trả!' }]}
							>
								<DatePicker
									style={{ width: '100%' }}
									size='large'
									format='MM/DD/YYYY'
									disabledDate={(current) => current && current < moment().startOf('day')}
								/>
							</Form.Item>
						</div>

						<Form.Item
							label={<span style={{ fontWeight: 600 }}>Số lượng</span>}
							name='quantity'
							rules={[{ required: true }]}
						>
							<Space>
								<Button icon={<MinusOutlined />} onClick={() => changeQuantity(-1)} />
								<Input style={{ width: '60px', textAlign: 'center', fontWeight: 'bold' }} />
								<Button icon={<PlusOutlined />} onClick={() => changeQuantity(1)} />
							</Space>
						</Form.Item>

						<Form.Item style={{ marginBottom: 0 }}>
							<Space size='middle'>
								<Button type='primary' htmlType='submit' loading={submitting} icon={<SendOutlined />}>
									Gửi yêu cầu
								</Button>
								<Button onClick={handleCancel}>Hủy</Button>
							</Space>
						</Form.Item>
					</Form>
				</Card>
			</div>
		</div>
	);
};

export default YeuCauMuonThietBi;
