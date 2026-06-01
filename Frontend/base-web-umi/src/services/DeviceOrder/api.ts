import { request } from 'umi';

/** 1. Hàm lấy danh sách toàn bộ yêu cầu mượn thiết bị từ Backend */
export async function getOrderList(params?: any) {
  return request('/api/v1/device-orders', {
    method: 'GET',
    params,
  });
}

/** 2. Hàm cập nhật trạng thái đơn (Duyệt, Từ chối kèm lý do, Trả thiết bị) */
export async function updateOrderStatus(params: { id: string; status: string; rejectReason?: string; actualReturnDate?: string }) {
  return request(`/api/v1/device-orders/${params.id}/status`, {
    method: 'PUT',
    data: {
      status: params.status,
      rejectReason: params.rejectReason,
      actualReturnDate: params.actualReturnDate,
    },
  });
}