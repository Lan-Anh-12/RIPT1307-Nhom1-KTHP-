import axios from '@/utils/axios';
import type { DeviceType } from './typing';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

/**
 * API lấy danh sách thiết bị từ Backend
 * @param keyword Từ khóa tìm kiếm
 */
export async function getDeviceList(keyword?: string): Promise<DeviceType[]> {
    // Sử dụng axios trực tiếp
    const response = await axios.get(`${BASE_URL}/api/devices`, {
        params: {
            keyword,
        },
    });

    // Xử lý dữ liệu:
    // 1. Nếu axios interceptor đã trả về thẳng response.data (thường là mảng luôn):
    // return response; 

    // 2. Nếu response là một object bao gồm { data: [...] } (phổ biến trong nhiều API):
    // Truy cập vào thuộc tính chứa mảng dữ liệu. 
    // Nếu API trả về mảng trực tiếp, dòng dưới đây sẽ lấy chính mảng đó.
    return (response as any).data || response || [];
}