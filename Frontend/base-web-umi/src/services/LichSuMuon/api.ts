export async function getMyBorrowHistory() {
    // Lấy tên sinh viên từ localStorage (hoặc chỗ bạn lưu tên)
    const studentName = localStorage.getItem('userName'); 
    
    if (!studentName) {
        console.error("Không tìm thấy tên sinh viên!");
        return [];
    }

    // API của bạn là GET /api/requests/search?name=...
    const response = await axios.get(`${BASE_URL}/api/requests/search`, {
        params: {
            name: studentName // Đây là tham số 'name' mà Controller mong đợi
        }
    });
    
    return response.data;
}