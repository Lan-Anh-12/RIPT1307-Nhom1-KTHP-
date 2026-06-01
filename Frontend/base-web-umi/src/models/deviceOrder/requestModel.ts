import { useState, useCallback } from 'react';
import { getOrderList, updateOrderStatus } from '@/services/DeviceOrder/api';

export default function useRequestModel() {
  // Kho dữ liệu gốc phục vụ chạy thử nghiệm (Demo) mượt mà
  const [allRequests, setAllRequests] = useState<any[]>([
    {
      id: 'REQ-001',
      studentName: 'Nguyễn Văn A',
      studentCode: 'B24DCCC218',
      studentEmail: 'anv_b24dccc111@student.ptit.edu.vn',
      deviceName: 'Máy chiếu Epson EB-X51',
      quantity: 1,
      requestDate: '2026-05-28 08:30:00',
      borrowDate: '2026-06-01',
      returnDate: '2026-06-02',
      status: 'cho_duyet',
      totalRequests: 1,
    },
    {
      id: 'REQ-002',
      studentName: 'Trần Thị B',
      studentCode: 'B24DCCC999',
      studentEmail: 'btt_b24dccc999@student.ptit.edu.vn',
      deviceName: 'Micro không dây Shure',
      quantity: 2,
      requestDate: '2026-05-27 14:15:22',
      borrowDate: '2026-06-03',
      returnDate: '2026-06-03',
      status: 'da_duyet',
      totalRequests: 3,
    },
  ]);

  // Khởi tạo state hiển thị ban đầu bằng chính kho dữ liệu gốc ban đầu để không bị trống bảng
  const [displayedRequests, setDisplayedRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  /** 🔄 Hàm lọc tìm kiếm kết hợp thông minh tại local */
  const fetchRequests = useCallback(async (filters?: { keyword?: string; status?: string }) => {
    setLoading(true);
    try {
      const res = await getOrderList(filters);
      if (res?.success) {
        setDisplayedRequests(res.data);
        setAllRequests(res.data);
      } else {
        // GIẢ LẬP BỘ LỌC KHI CHƯA CÓ BACKEND
        let result = [...allRequests];

        // 1. Tìm kiếm theo từ khóa (Tên SV, Mã SV, Tên thiết bị)
        if (filters?.keyword) {
          const searchKey = filters.keyword.toLowerCase().trim();
          result = result.filter(item => 
            (item.studentName && item.studentName.toLowerCase().includes(searchKey)) || 
            (item.studentCode && item.studentCode.toLowerCase().includes(searchKey)) ||
            (item.deviceName && item.deviceName.toLowerCase().includes(searchKey))
          );
        }

        // 2. Lọc theo danh mục trạng thái Tab Select
        if (filters?.status && filters.status !== 'ALL') {
          result = result.filter(item => item.status === filters.status);
        }

        setDisplayedRequests(result);
        setHasFetched(true); // Đánh dấu đã thực hiện lọc/fetch ít nhất một lần
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [allRequests]);

  /** 📝 Hàm tiếp nhận cập nhật trạng thái từ thanh Timeline của DetailModal */
  const handleUpdateStatus = useCallback(async (params: { id: string; status: string; rejectReason?: string; actualReturnDate?: string }) => {
    setLoading(true);
    try {
      // Hàm cập nhật trạng thái tiện ích cho cả 2 mảng state cùng lúc
      const updateData = (prev: any[]) =>
        prev.map((item) =>
          item.id === params.id 
            ? { 
                ...item, 
                status: params.status, 
                rejectReason: params.rejectReason,
                actualReturnDate: params.actualReturnDate 
              } 
            : item
        );

      setAllRequests(updateData);
      setDisplayedRequests(updateData);

      // Gọi API gửi lên Server ngầm
      try {
        await updateOrderStatus(params);
      } catch (apiErr) {
        console.log('Backend chưa kết nối, dữ liệu local đã được cập nhật!');
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // 🛠️ ĐÃ SỬA: Trả về displayedRequests một cách nhất quán. Nếu chưa lọc lần nào thì trả về kho tổng ban đầu.
    requests: hasFetched ? displayedRequests : allRequests,
    loading,
    fetchRequests,
    handleUpdateStatus,
  };
}