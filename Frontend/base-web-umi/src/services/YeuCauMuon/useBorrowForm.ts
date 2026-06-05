import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useLocation } from 'umi';
import { getActiveDevices, createBorrowRequest } from './api'; // Cùng cấp thư mục service

const IS_MOCK = true;

const mockDeviceDatabase: BorrowRequestSpace.DeviceModel[] = [
	{ id: 'DEV-001', name: 'Máy chiếu Epson EB-X51', stock: 5 },
	{ id: 'DEV-002', name: 'Máy tính xách tay Dell Latitude 5520', stock: 8 },
	{ id: 'DEV-003', name: 'Micro không dây Shure BLX24', stock: 0 },
];

export const useBorrowForm = () => {
	const [form] = Form.useForm<BorrowRequestSpace.FormValues>();
	const location = useLocation();
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [devices, setDevices] = useState<BorrowRequestSpace.DeviceModel[]>([]);

	useEffect(() => {
		const fetchDevices = async () => {
			try {
				if (IS_MOCK) {
					await new Promise((resolve) => setTimeout(resolve, 500));
					setDevices(mockDeviceDatabase);
				} else {
					const response = await getActiveDevices();
					if (response && response.data) {
						setDevices(response.data);
					}
				}
			} catch (error) {
				message.error('Không thể tải danh sách thiết bị từ hệ thống!');
			}
		};
		fetchDevices();
	}, []);

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const deviceIdFromUrl = searchParams.get('deviceId');

		if (deviceIdFromUrl) {
			form.setFieldsValue({ deviceId: deviceIdFromUrl });
		}
	}, [location.search, form]);

	const changeQuantity = (amount: number) => {
		const currentQty = form.getFieldValue('quantity') || 1;
		const newQty = Math.max(1, currentQty + amount);
		form.setFieldsValue({ quantity: newQty });
	};

	const handleSubmit = async (values: BorrowRequestSpace.FormValues) => {
		setSubmitting(true);
		try {
			const currentUserId = Number(localStorage.getItem('userId')) || 1;

			const payload: BorrowRequestSpace.CreateBorrowPayload = {
				device_model_id: values.deviceId,
				borrow_date: values.startDate?.format('YYYY-MM-DD'),
				expected_return_date: values.endDate?.format('YYYY-MM-DD'),
				quantity: values.quantity,
				app_user_id: currentUserId,
				status: 'PENDING',
			};

			if (IS_MOCK) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				console.log('Đã Mock gửi đơn mượn với dữ liệu:', payload);
			} else {
				await createBorrowRequest(payload);
			}

			message.success('Gửi yêu cầu mượn thiết bị thành công!');
			form.resetFields();
			form.setFieldsValue({ quantity: 1 });
		} catch (error) {
			message.error('Gửi yêu cầu thất bại. Vui lòng thử lại!');
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		form.setFieldsValue({ quantity: 1 });
		message.info('Đã hủy nhập đơn yêu cầu.');
	};

	return {
		form,
		submitting,
		deviceOptions: devices,
		changeQuantity,
		handleSubmit,
		handleCancel,
	};
};
