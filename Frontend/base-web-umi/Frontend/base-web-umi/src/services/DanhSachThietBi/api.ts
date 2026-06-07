import axios from '@/utils/axios';
import type { DeviceType } from './typing';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

/**
 * API lấy danh sách thiết bị từ Backend
 * @param keyword Từ khóa tìm kiếm
 */
export async function getDeviceList(keyword?: string): Promise<DeviceType[]> {
	const response = await axios.get(`${BASE_URL}/api/devices`, {
		params: {
			keyword,
		},
	});

	return (response as any).data || response || [];
}
