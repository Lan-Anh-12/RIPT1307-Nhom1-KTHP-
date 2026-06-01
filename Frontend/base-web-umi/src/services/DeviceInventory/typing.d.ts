declare namespace DeviceInventory {
  type InventoryStatus = 'con_hang' | 'het_hang';

  interface InventoryItem {
    id: string;
    name: string;
    category: string;
    stock: number;
    status: InventoryStatus;
    image?: string; 
    description?: string;
  }
// du lieu cho form them sua xoa
  interface DeviceFormParams {
    name: string;
    category: string;
    stock: number;
    status: InventoryStatus;
    description?: string;
    imageFile?: any;
  }

  interface InventoryResponse {
    data: InventoryItem[];
    success: boolean;
    total?: number;
  }
}