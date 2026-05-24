// src/pages/YeuCauMuon/useBorrowForm.ts
import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useLocation } from 'umi'; // Hoặc react-router-dom tùy phiên bản dự án của bạn

// Giả lập danh sách thiết bị để đổ vào ô Select dropdown
const mockDeviceOptions = [
	{ id: 'DEV-001', name: 'Máy chiếu Epson EB-X51' },
	{ id: 'DEV-002', name: 'Máy tính xách tay Dell Latitude 5520' },
	{ id: 'DEV-003', name: 'Micro không dây Shure BLX24' },
];

export const useBorrowForm = () => {
	const [form] = Form.useForm();
	const location = useLocation();
	const [submitting, setSubmitting] = useState(false);

	// 🌟 TỰ ĐỘNG LẤY DEVICEID TỪ URL KHI TRANG ĐƯỢC LOAD
	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const deviceIdFromUrl = searchParams.get('deviceId');

		if (deviceIdFromUrl) {
			// Nếu trên URL có ?deviceId=DEV-001, tự động set giá trị vào Form luôn
			form.setFieldsValue({ deviceId: deviceIdFromUrl });
		}
	}, [location.search, form]);

	// Hàm xử lý tăng/giảm số lượng bằng nút + / -
	const changeQuantity = (amount: number) => {
		const currentQty = form.getFieldValue('quantity') || 1;
		const newQty = Math.max(1, currentQty + amount); // Không cho giảm xuống dưới 1
		form.setFieldsValue({ quantity: newQty });
	};

	// Hàm xử lý khi bấm nút "Gửi yêu cầu"
	const handleSubmit = async (values: any) => {
		setSubmitting(true);
		try {
			// Chuẩn hóa định dạng ngày tháng trước khi gửi lên Server
			const submitData = {
				...values,
				startDate: values.startDate?.format('YYYY-MM-DD'),
				endDate: values.endDate?.format('YYYY-MM-DD'),
			};

			console.log('Dữ liệu gửi lên server:', submitData);

			// Giả lập gọi API đợi 1 giây
			await new Promise((resolve) => setTimeout(resolve, 1000));

			message.success('Gửi yêu cầu mượn thiết bị thành công!');
			form.resetFields(); // Reset sạch form sau khi gửi thành công
			form.setFieldsValue({ quantity: 1 }); // Đặt lại số lượng mặc định là 1
		} catch (error) {
			message.error('Có lỗi xảy ra, vui lòng thử lại!');
		} finally {
			setSubmitting(false);
		}
	};

	// Hàm xử lý khi bấm nút "Hủy"
	const handleCancel = () => {
		form.resetFields();
		form.setFieldsValue({ quantity: 1 });
		message.info('Đã hủy nhập đơn yêu cầu.');
	};

	return {
		form,
		submitting,
		mockDeviceOptions,
		changeQuantity,
		handleSubmit,
		handleCancel,
	};
};
