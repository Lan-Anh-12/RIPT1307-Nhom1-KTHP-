// Sửa file api.ts
import axios from 'axios'; // Dùng trực tiếp axios thay vì import từ utils/axios

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

export async function getNotificationList() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Đảm bảo key này đúng với lúc bạn lưu sau khi login

    return (await axios.get(`${BASE_URL}/api/notifications/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}` // Phải có tiền tố "Bearer "
        }
    })).data;
}

export async function markNotificationAsRead(id: number): Promise<any> {
    return axios.put(`${BASE_URL}/api/notifications/${id}/read`, {}, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
    });
}