export interface DeviceType {
	id: number;
	name: string;
	categoryId?: number;
	category: string;
	status: string;
	statusType?: 'success' | 'warning' | 'error' | 'default';
	description?: string;
	quantity: number;
	imageUrl?: string;
}
