import { useState, useCallback } from 'react';
import { getInventoryList, addDevice, updateDevice, deleteDevice } from '@/services/DeviceInventory/api';
import { message } from 'antd';

export default function useDeviceInventoryModel() {
  const [devices, setDevices] = useState<DeviceInventory.InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Mảng danh mục cố định tương ứng ID trong Database Backend
  const categories = [
    { value: 1, label: 'Máy chiếu' },
    { value: 2, label: 'Mạng' },
    { value: 3, label: 'Bảng tương tác' },
    { value: 4, label: 'Laptop' },
    { value: 5, label: 'Âm thanh' },
    { value: 5, label: 'Máy quay' },
    { value: 5, label: 'Màn hình' },
    { value: 5, label: 'Máy in' },
    { value: 5, label: 'Bộ đàm' },
  ];

  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dyfrsmo2t/image/upload';
  const UPLOAD_PRESET = 'khoanh';

  const uploadToCloudinary = async (fileObj: any): Promise<string> => {
    if (!fileObj) return '';
    let rawFile = fileObj.file?.originFileObj || fileObj.file || fileObj.fileList?.[0]?.originFileObj;
    if (!rawFile) return '';
    const formData = new FormData();
    formData.append('file', rawFile);
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
      const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
      const data = await response.json();
      return data?.secure_url || '';
    } catch (error) {
      return '';
    }
  };

  /** 🔄 1. Tải danh sách thiết bị */
  const fetchDevices = useCallback(async (filters?: { keyword?: string; categoryId?: number }) => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters?.keyword?.trim()) params.keyword = filters.keyword.trim();

      // Gọi API (API lúc này đã được định nghĩa trả về chuẩn mảng InventoryItem)
      const res = await getInventoryList(params);
      let dataList = Array.isArray(res) ? res : (res as any)?.data || [];

      // Bộ lọc danh mục local hộ Backend
      if (filters?.categoryId) {
        dataList = dataList.filter((item: DeviceInventory.InventoryItem) => 
          item.category?.id === filters.categoryId || item.categoryId === filters.categoryId
        );
      }

      setDevices(dataList);
    } catch (error) {
      message.error('Không thể tải danh sách thiết bị!');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Thêm thiết bị (Dùng Type DeviceFormParams nhận từ Form Antd) */
  const handleAddDevice = useCallback(async (values: DeviceInventory.DeviceFormParams) => {
    setLoading(true);
    try {
      let finalImageUrl = '';
      if (values.imageFile) {
        finalImageUrl = await uploadToCloudinary(values.imageFile);
      }

      await addDevice({
        name: values.name,
        categoryId: Number(values.categoryId),
        imageUrl: finalImageUrl || undefined,
        quantity: Number(values.stock), // Đổi từ stock (giao diện) thành quantity (Backend DTO)
        description: values.description,
      });

      message.success('Thêm thiết bị vào kho thành công!');
      fetchDevices();
      return true;
    } catch (error) {
      message.error('Thêm thiết bị thất bại!');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDevices]);

  /** Sửa thiết bị  */
  const handleUpdateDevice = useCallback(async (id: number, values: DeviceInventory.DeviceFormParams, currentImageUrl?: string) => {
    setLoading(true);
    try {
      let finalImageUrl = currentImageUrl || '';
      if (values.imageFile?.file) {
        finalImageUrl = await uploadToCloudinary(values.imageFile);
      }

      await updateDevice(id, {
        name: values.name,
        categoryId: Number(values.categoryId),
        imageUrl: finalImageUrl,
        quantity: Number(values.stock),
        description: values.description,
      });

      message.success('Cập nhật thiết bị thành công!');
      fetchDevices();
      return true;
    } catch (error) {
      message.error('Cập nhật thất bại!');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDevices]);

  /** Xóa thiết bị */
  const handleDeleteDevice = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await deleteDevice(id); 
      message.success('Đã xóa thiết bị khỏi hệ thống.');
      fetchDevices();
      return true;
    } catch (error) {
      message.error('Xóa thiết bị thất bại!');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDevices]);

  return { devices, categories, loading, fetchDevices, handleAddDevice, handleUpdateDevice, handleDeleteDevice };
}
