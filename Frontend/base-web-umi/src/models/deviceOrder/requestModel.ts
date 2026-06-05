import { useState, useCallback } from 'react';
import { getRequests, updateRequestStatus } from '@/services/DeviceOrder/api';
export default function useRequestModel() {
  const [requests, setRequests] = useState<API.RequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy danh sách yêu cầu
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRequests();
      setRequests(res.data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Xử lý cập nhật trạng thái (Duyệt, Từ chối, Trả thiết bị)
  const handleUpdateStatus = useCallback(async (params: API.UpdateStatusParams) => {
    try {
      const res = await updateRequestStatus(params);
      if (res.success) {
        await fetchRequests(); // Refresh lại dữ liệu
        return true;
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
    return false;
  }, [fetchRequests]);

  return {
    requests,
    loading,
    fetchRequests,
    handleUpdateStatus,
  };
}