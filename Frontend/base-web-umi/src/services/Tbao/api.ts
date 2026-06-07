import axios from 'axios';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

export async function getNotificationList() {
	const userId = localStorage.getItem('userId');
	const token = localStorage.getItem('token');

	return (
		await axios.get(`${BASE_URL}/api/notifications/user/${userId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
	).data;
}

export async function markNotificationAsRead(id: number): Promise<any> {
	return axios.put(
		`${BASE_URL}/api/notifications/${id}/read`,
		{},
		{
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
		},
	);
}
