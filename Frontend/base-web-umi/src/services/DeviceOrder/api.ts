// Giả định dữ liệu ban đầu lưu ở Front-End để test
let mockRequests: API.RequestItem[] = [
  {
    id: 'REQ-2025-001',
    studentName: 'Nguyễn Văn An',
    studentCode: 'SV001',
    studentEmail: 'an.nv@student.edu.vn',
    totalRequests: 5,
    deviceName: 'Máy chiếu Epson EB-X51',
    quantity: 1,
    requestDate: '09/05/2025',
    borrowDate: '10/05/2025',
    returnDate: '17/05/2025',
    actualReturnDate: '17/05/2025',
    status: 'da_tra',
  },
  {
    id: 'REQ-2026-002',
    studentName: 'Trần Thị Bích',
    studentCode: 'SV002',
    studentEmail: 'bich.tt@student.edu.vn',
    totalRequests: 2,
    deviceName: 'Micro không dây Sony',
    quantity: 2,
    requestDate: '24/05/2026',
    borrowDate: '25/05/2026',
    returnDate: '01/06/2026',
    status: 'cho_duyet',
  },
];

export async function getRequests(): Promise<{ data: API.RequestItem[] }> {
  return { data: [...mockRequests] };
}

export async function updateRequestStatus(params: API.UpdateStatusParams): Promise<{ success: boolean }> {
  mockRequests = mockRequests.map((item) => {
    if (item.id === params.id) {
      return {
        ...item,
        status: params.status,
        actualReturnDate: params.actualReturnDate || item.actualReturnDate,
      };
    }
    return item;
  });
  return { success: true };
}