import axios from 'axios';

export const baseURL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use((config) => {
	const jwt = localStorage.getItem('jwt') || ' ';
	config.headers.Authorization = `Bearer ${jwt}`;
	return config;
});

export function logoutUser()  {
	localStorage.removeItem('jwt');
}

export default axiosInstance;