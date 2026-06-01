import { useState, useCallback } from 'react';
import { getInventoryList, addDevice, updateDevice, deleteDevice } from '@/services/DeviceInventory/api';
import { message } from 'antd';

export default function useDeviceInventoryModel() {
  // Kho dữ liệu gốc (Backup state) để lưu trữ đầy đủ danh sách ban đầu phục vụ lọc local
  const [allDevices, setAllDevices] = useState<DeviceInventory.InventoryItem[]>([]);
  // State thực tế đổ vào Bảng (Table) sau khi đã lọc qua các điều kiện nghiêm ngặt
  const [devices, setDevices] = useState<DeviceInventory.InventoryItem[]>([]);
  // State bật/tắt hiệu ứng xoay xoay loading khi đợi mạng tải
  const [loading, setLoading] = useState<boolean>(false);

  // Điền thông tin tài khoản Cloudinary của bạn vào đây
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dyfrsmo2t/image/upload';
  const UPLOAD_PRESET = 'khoanh'; // Tên preset cấu hình Unsigned trên Cloudinary

  const uploadToCloudinary = async (fileObj: any): Promise<string> => {
    // 1. Kiểm tra nếu không có dữ liệu file truyền vào
    if (!fileObj) return '';

    let rawFile = null;

    // 2. Mẹo bóc tách file chuẩn Ant Design:
    if (fileObj.file && fileObj.file.originFileObj) {
      rawFile = fileObj.file.originFileObj;
    } else if (fileObj.file) {
      rawFile = fileObj.file;
    } else if (Array.isArray(fileObj.fileList) && fileObj.fileList.length > 0) {
      rawFile = fileObj.fileList[0].originFileObj || fileObj.fileList[0];
    }

    // Nếu lục lọi mọi ngóc ngách mà vẫn không tìm thấy file thô thì dừng lại
    if (!rawFile) {
      console.error('Không tìm thấy file thô (originFileObj)!');
      return '';
    }

    // 3. Tiến hành đóng gói để ship lên Cloudinary
    const formData = new FormData();
    formData.append('file', rawFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data?.secure_url) {
        return data.secure_url;
      } else {
        console.error('Cloudinary trả về lỗi:', data);
        return '';
      }
    } catch (error) {
      console.error('Lỗi kết nối mạng khi gọi Cloudinary:', error);
      return '';
    }
  };

  /** 🔄 Hàm lấy dữ liệu đổ vào Bảng kết hợp BỘ LỌC LOCAL NGHIÊM NGẶT */
  const fetchDevices = useCallback(async (filters?: { keyword?: string; category?: string }) => {
    setLoading(true);
    try {
      const res = await getInventoryList(filters);
      if (res?.success) {
        setDevices(res.data);
        setAllDevices(res.data);
      } else {
        // MOCK DATA BAN ĐẦU (Nếu backend chưa chạy)
        let mockData: DeviceInventory.InventoryItem[] = allDevices;
        if (allDevices.length === 0) {
          mockData = [
            {
              id: 'DEV-001',
              name: 'Máy chiếu Epson EB-X51',
              category: 'Máy chiếu',
              stock: 5,
              status: 'con_hang',
              image: 'https://tanphat.com.vn/media/product/4498_viewsonic_pa503xb.jpg',
              description: 'Máy chiếu độ phân giải XGA, độ sáng 3800 Ansi Lumens.'
            }
          ];
        }

        // TIẾN HÀNH LỌC TUẦN TỰ KHÔNG PHỤ THUỘC BACKEND
        let result = [...mockData];

        // 1. Lọc nghiêm ngặt theo đúng Danh mục được chọn trước (Chọn Micro thì chỉ giữ Micro)
        if (filters?.category && filters.category !== 'ALL') {
          result = result.filter(item => item.category === filters.category);
        }

        // 2. Lọc tiếp theo Từ khóa tìm kiếm trên tập kết quả của danh mục vừa chọn
        if (filters?.keyword) {
          const searchKey = filters.keyword.toLowerCase().trim();
          result = result.filter(item => 
            (item.name && item.name.toLowerCase().includes(searchKey)) ||
            (item.id && item.id.toLowerCase().includes(searchKey))
          );
        }

        // Đồng bộ dữ liệu hiển thị (Nếu không thỏa mãn bộ lọc, result tự động rỗng [])
        setDevices(result);
        if (allDevices.length === 0) {
          setAllDevices(mockData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [allDevices]);

  /** ➕ Hàm xử lý Thêm thiết bị */
  const handleAddDevice = useCallback(async (values: DeviceInventory.DeviceFormParams) => {
    setLoading(true);
    try {
      let finalImageUrl = '';

      if (values.imageFile) {
        message.loading({ content: 'Đang tải hình ảnh lên Cloudinary...', key: 'inv_upload' });
        finalImageUrl = await uploadToCloudinary(values.imageFile);
        if (!finalImageUrl) {
          message.error({ content: 'Không tải được hình ảnh lên Cloudinary!', key: 'inv_upload' });
          return false;
        }
        message.success({ content: 'Tải ảnh lên đám mây thành công!', key: 'inv_upload', duration: 1 });
      }

      const newDevice: DeviceInventory.InventoryItem = {
        id: `DEV-${Math.floor(100 + Math.random() * 900)}`,
        name: values.name,
        category: values.category,
        stock: values.stock,
        status: values.status,
        description: values.description,
        image: finalImageUrl || 'https://via.placeholder.com/40',
      };

      // Đồng bộ đè vào cả kho tổng lẫn mảng hiển thị hiện hành
      setAllDevices((prevList) => [newDevice, ...prevList]);
      setDevices((prevList) => [newDevice, ...prevList]);

      try {
        await addDevice({
          name: values.name,
          category: values.category,
          stock: values.stock,
          status: values.status,
          description: values.description,
          image: finalImageUrl,
        });
      } catch (apiErr) {
        console.log('Backend chưa bật hoặc lỗi, nhưng UI vẫn cập nhật local để test!', apiErr);
      }

      message.success('Thêm thiết bị vào kho thành công!');
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, [uploadToCloudinary]);

  /** 📝 Hàm xử lý Chỉnh sửa thiết bị */
  const handleUpdateDevice = useCallback(async (id: string, values: DeviceInventory.DeviceFormParams, currentImageUrl?: string) => {
    setLoading(true);
    try {
      let finalImageUrl = currentImageUrl || '';

      if (values.imageFile && values.imageFile.file) {
        message.loading({ content: 'Đang cập nhật hình ảnh mới...', key: 'inv_upload' });
        finalImageUrl = await uploadToCloudinary(values.imageFile);
      }

      const updateCallback = (prevList: DeviceInventory.InventoryItem[]) =>
        prevList.map((item) =>
          item.id === id
            ? {
                ...item,
                name: values.name,
                category: values.category,
                stock: values.stock,
                status: values.status,
                description: values.description,
                image: finalImageUrl,
              }
            : item
        );

      // Cập nhật đồng thời ở cả kho tổng gốc và kho đang hiển thị
      setAllDevices(updateCallback);
      setDevices(updateCallback);

      try {
        await updateDevice(id, {
          name: values.name,
          category: values.category,
          stock: values.stock,
          status: values.status,
          description: values.description,
          image: finalImageUrl,
        });
      } catch (apiErr) {
        console.log('Backend sửa lỗi, UI vẫn cập nhật local!', apiErr);
      }

      message.success('Cập nhật thông tin thiết bị thành công!');
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, [uploadToCloudinary]);

  /** 🗑️ Hàm xử lý Xóa thiết bị */
  const handleDeleteDevice = useCallback(async (id: string) => {
    try {
      try {
        await deleteDevice(id);
      } catch (apiErr) {
        console.log('Backend lỗi/chưa có, tiến hành xóa local.');
      }
      
      message.success('Đã xóa thiết bị khỏi kho.');
      
      // Xóa đồng bộ ở cả 2 mảng state
      setAllDevices((prev) => prev.filter((item) => item.id !== id));
      setDevices((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  return { devices, loading, fetchDevices, handleAddDevice, handleUpdateDevice, handleDeleteDevice };
}