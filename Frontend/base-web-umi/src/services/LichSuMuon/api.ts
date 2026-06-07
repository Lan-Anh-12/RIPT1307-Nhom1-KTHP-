import axios from '@/utils/axios';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

// Lấy danh sách lịch sử mượn bằng cách tìm kiếm theo tên sinh viên đã lưu trong localStorage
export async function getBorrowHistoryList() {
    const studentName = localStorage.getItem('userName'); // Lấy tên đã lưu khi login
    
    // Gọi API search theo name đã có sẵn trong Controller của bạn
    return (await axios.get(`${BASE_URL}/api/requests/search`, {
        params: { name: studentName }
    })).data;
}