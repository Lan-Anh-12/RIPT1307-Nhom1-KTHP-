import { useState, useMemo, useEffect } from 'react';
import { message, Modal } from 'antd';
import { getBorrowHistoryList, cancelBorrowRequest } from './api';

export const useBorrowHistory = () => {
    const [data, setData] = useState<BorrowHistorySpace.HistoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

    const fetchHistory = async () => {
    setLoading(true);
    try {
        const response = await getBorrowHistoryList();
        
        // LOG CỰC KỲ QUAN TRỌNG
        console.log("--- BẮT ĐẦU KIỂM TRA DỮ LIỆU ---");
        console.log("Response từ server:", response);
        if (response && response.length > 0) {
            console.log("Trường dữ liệu mẫu:", Object.keys(response[0]));
            // Kiểm tra xem nó có chứa 'device', 'idRequest' như interface của bạn không
        } else {
            console.log("Server trả về mảng rỗng []");
        }
        
        setData(response || []);
    } catch (error) {
        console.error("Lỗi gọi API:", error);
        message.error('Không thể tải lịch sử mượn!');
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchHistory();
    }, []);

    const stats = useMemo<BorrowHistorySpace.HistoryStats>(() => {
        return {
            pending: data.filter((item) => item.status === 'PENDING').length,
            approved: data.filter((item) => item.status === 'APPROVED').length,
            rejected: data.filter((item) => item.status === 'REJECTED').length,
            returned: data.filter((item) => item.status === 'RETURNED').length,
        };
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // SỬA: Dùng item.device thay vì item.deviceName
            const matchesSearch = item.device?.toLowerCase().includes(searchText.toLowerCase());
            
            let matchesStatus = false;
            if (statusFilter === 'Tất cả') matchesStatus = true;
            else if (statusFilter === 'Chờ duyệt' && item.status === 'PENDING') matchesStatus = true;
            else if (statusFilter === 'Đã duyệt' && item.status === 'APPROVED') matchesStatus = true;
            else if (statusFilter === 'Từ chối' && item.status === 'REJECTED') matchesStatus = true;
            else if (statusFilter === 'Đã trả' && item.status === 'RETURNED') matchesStatus = true;

            return matchesSearch && matchesStatus;
        });
    }, [data, searchText, statusFilter]);

    const handleCancelRequest = (record: BorrowHistorySpace.HistoryItem) => {
        if (record.status !== 'PENDING') {
            message.warning('Không thể hủy đơn hàng đã được xử lý!');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận hủy yêu cầu',
            content: `Bạn có chắc muốn hủy yêu cầu mượn thiết bị "${record.device}" này không?`,
            okText: 'Hủy yêu cầu',
            okType: 'danger',
            centered: true,
            onOk: async () => {
                try {
                    // SỬA: Dùng record.idRequest thay vì record.id
                    await cancelBorrowRequest(record.idRequest);
                    message.success('Đã hủy thành công!');
                    await fetchHistory(); 
                } catch (error: any) {
                    message.error(error?.response?.data?.message || 'Hủy thất bại!');
                }
            },
        });
    };

    return {
        searchText,
        setSearchText,
        statusFilter,
        setStatusFilter,
        stats,
        filteredData,
        loading,
        handleCancelRequest,
    };
};