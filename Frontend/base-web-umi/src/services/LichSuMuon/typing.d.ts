declare namespace BorrowHistorySpace {
    interface HistoryItem {
        idRequest: number;        // Khớp với private Long idRequest;
        studentId: number;        // Khớp với private Long studentId;
        studentName: string;      // Khớp với private String studentName;
        device: string;           // Khớp với private String device; (Tên thiết bị)
        quantity: number;         // Khớp với private Integer quantity;
        requestDate: string;      // Khớp với private LocalDate requestDate;
        actualReturnDate: string | null;
        expectedReturnDate: string;
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | string;
        totalRequest: number;     // Khớp với private Integer totalRequest;
        email: string;            // Khớp với private String email;
    }

    // Bổ sung mảnh ghép còn thiếu này:
    interface HistoryStats {
        pending: number;
        approved: number;
        rejected: number;
        returned: number;
    }
}