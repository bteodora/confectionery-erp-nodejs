import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const baseURL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use((config) => {
	const jwt = localStorage.getItem('jwt') || ' ';
	config.headers.Authorization = `Bearer ${jwt}`;
	return config;
});

export function getUserProfile() {
	try {
		const token = localStorage.getItem('jwt');
		return jwtDecode(token);
	  } catch (error) {
		console.error("Invalid token", error);
		return { username: null, role: null };
	  }
}

export function logoutUser()  {
	localStorage.removeItem('jwt');
}

export default axiosInstance;