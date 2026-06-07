import { useState, useCallback } from 'react';
import { 
  getOrderList, 
  searchRequestsByName, 
  getRequestById,  
  updateOrderStatus, 
} from '@/services/DeviceOrder/api'; 
import { message } from 'antd';

export default function useRequestModel() {
  const [allRequests, setAllRequests] = useState<DeviceRequest.RequestItem[]>([]);
  const [displayedRequests, setDisplayedRequests] = useState<DeviceRequest.RequestItem[]>([]);
  const [currentRequest, setCurrentRequest] = useState<DeviceRequest.RequestItem | null>(null); 
  
  const [loading, setLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  

  /** 1. TÌM KIẾM & LỌC DANH SÁCH ĐƠN (Khớp endpoint /all và /search của Java) */
  const fetchRequests = useCallback(async (filters?: { keyword?: string; status?: string }) => {
    setLoading(true);
    try {
      let resList: DeviceRequest.RequestItem[] = [];
      
      if (filters?.keyword && filters.keyword.trim() !== '') {
        resList = await searchRequestsByName(filters.keyword.trim());
      } else {
        resList = await getOrderList();
      }

      const dataList = Array.isArray(resList) ? resList : (resList as any)?.data || [];
      
      // Lọc local theo Tab trạng thái hiển thị trên giao diện Antd
      if (filters?.status && filters.status !== 'ALL') {
        const upperStatus = filters.status.toUpperCase();
        setDisplayedRequests(dataList.filter((item: DeviceRequest.RequestItem) => item.status?.toUpperCase() === upperStatus));
      } else {
        setDisplayedRequests(dataList);
      }
      
      setAllRequests(dataList);
      setHasFetched(true);
    } catch (error) {
      message.error('Không thể tải danh sách yêu cầu từ máy chủ!');
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 2. LẤY CHI TIẾT 1 YÊU CẦU THEO ID (GET /api/requests/{id}) */
  const fetchRequestDetail = useCallback(async (id: number) => {
    setDetailLoading(true);
    try {
      const res = await getRequestById(id);
      if (res) {
        const detailData = (res as any).data || res;
        setCurrentRequest(detailData);
        return detailData;
      }
    } catch (error) {
      message.error('Không thể lấy thông tin chi tiết đơn hàng!');
    } finally {
      setDetailLoading(false);
    }
    return null;
  }, []);

  /**  3. CẬP NHẬT TRẠNG THÁI ĐƠN (PUT /api/requests/{id}/status) */
  const handleUpdateStatus = useCallback(async (idRequest: number, status: 'APPROVED' | 'REJECTED' | 'RETURNED', currentKeyword?: string, currentTab?: string) => {
    setLoading(true);
    try {
      await updateOrderStatus(idRequest, status);
      message.success('Cập nhật trạng thái thành công!');
      
      // Làm mới lại bảng dữ liệu ngay lập tức sau khi duyệt
      await fetchRequests({ keyword: currentKeyword, status: currentTab });
      return true;
    } catch (error) {
      message.error('Thao tác thất bại, vui lòng thử lại!');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchRequests]);

  return {
    requests: hasFetched ? displayedRequests : allRequests,
    currentRequest,    
    loading,
    detailLoading,     
    fetchRequests,
    fetchRequestDetail, 
    handleUpdateStatus,
  };
}