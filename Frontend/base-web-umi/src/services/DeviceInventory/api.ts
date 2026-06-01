import { request } from 'umi';

export async function getInventoryList (params? : any){
    return request<DeviceInventory.InventoryResponse>('/api/v1/inventory',{
        method: 'GET',
        params,
    })
}

export async function addDevice(data:Partial<DeviceInventory.InventoryResponse>) {
    return request('/api/v1/inventory',{
        method:'POST',
        data,
    })
}
export async function updateDevice(id: string, data:Partial<DeviceInventory.InventoryResponse>) {
    return request(`/api/v1/inventory/${id}`,{
        method:'PUT',
        data,
    })
}
export async function deleteDevice(id: string) {
    return request(`/api/v1/inventory/${id}`,{
        method:'DELETE',
    })
}
