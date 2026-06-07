import axios from '@/utils/axios';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

/**
 * API lấy danh sách thiết bị thực tế từ Backend
 */
export async function getActiveDevices(): Promise<BorrowRequestSpace.DeviceModel[]> {
    // Gọi thẳng axios.get
    const response = await axios.get(`${BASE_URL}/api/devices`);
    
    // Nếu API trả về { data: [...] }, lấy .data. Nếu trả về mảng trực tiếp, lấy response
    return (response as any).data || response || [];
}

/**
 * API gửi yêu cầu mượn thiết bị mới
 */
export async function createBorrowRequest(payload: BorrowRequestSpace.CreateBorrowPayload): Promise<any> {
    // Chuyển từ 'request' sang 'axios.post'
    const response = await axios.post(`${BASE_URL}/api/requests/create`, payload, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Trả về dữ liệu phản hồi
    return (response as any).data || response;
}