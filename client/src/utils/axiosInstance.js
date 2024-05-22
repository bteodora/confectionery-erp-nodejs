import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

axiosInstance.interceptors.request.use((config) => {
	const jwt = localStorage.getItem('jwt') || ' ';
	config.headers.Authorization = `Bearer ${jwt}`;
	config.headers['Content-Type'] = 'application/json';
	return config;
});

export function logoutUser()  {
	localStorage.removeItem('jwt');
}

export default axiosInstance;