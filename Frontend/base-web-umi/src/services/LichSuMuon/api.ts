// Chỉ dùng import axios từ thư viện gốc 'axios' thay vì '@/utils/axios'
import axiosOriginal from 'axios'; 

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

export async function getBorrowHistoryList() {
    const name = localStorage.getItem('userName') || '';
    
    // Gọi thẳng, bypass qua các interceptor của dự án
    const res = await axiosOriginal.get(`${BASE_URL}/api/requests/search`, {
        params: { name: name },
        headers: { 
            'Authorization': 'Bearer ' + localStorage.getItem("token") 
        }
    });
    
    return res.data;
}