import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useLocation, history } from 'umi';
import moment from 'moment';
import { getActiveDevices, createBorrowRequest } from './api';

export const useBorrowForm = () => {
    const [form] = Form.useForm<BorrowRequestSpace.FormValues>();
    const location = useLocation();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [devices, setDevices] = useState<BorrowRequestSpace.DeviceModel[]>([]);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await getActiveDevices();
                setDevices(Array.isArray(response) ? response : []);
            } catch (error) {
                message.error('Không thể tải danh sách thiết bị!');
            }
        };
        fetchDevices();
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const deviceIdFromUrl = searchParams.get('deviceId');
        if (deviceIdFromUrl) {
            form.setFieldsValue({ deviceItemId: Number(deviceIdFromUrl) });
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
            // LẤY GIÁ TRỊ TỪ DATEPICKER CỦA NGƯỜI DÙNG
            const payload: BorrowRequestSpace.CreateBorrowPayload = {
                requestDate: values.requestDate.format('YYYY-MM-DD'), 
                expectedReturnDate: values.expectedReturnDate.format('YYYY-MM-DD'),
                deviceItemId: Number(values.deviceItemId),
                quantity: values.quantity,
            };

            await createBorrowRequest(payload);
            
            message.success('Gửi yêu cầu mượn thiết bị thành công!');
            form.resetFields();
            history.push('/lich-su-muon');
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Gửi yêu cầu thất bại!');
        } finally {
            setSubmitting(false);
        }
    };

    return { form, submitting, deviceOptions: devices, changeQuantity, handleSubmit };
};