declare namespace API {
  type RequestStatus = 'cho_duyet' | 'da_duyet' | 'da_tra' | 'qua_han' | 'tu_choi';

  interface RequestItem {
    id: string; 
    studentName: string;
    studentEmail: string;
    studentCode: string;
    totalRequests: number; 
    deviceName: string; 
    quantity: number; 
    requestDate: string; 
    borrowDate: string; 
    returnDate: string; 
    actualReturnDate?: string; 
    status: RequestStatus; 
  }

  interface UpdateStatusParams {
    id: string;
    status: RequestStatus;
    rejectReason?: string;
    actualReturnDate?: string;
  }
}