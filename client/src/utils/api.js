import axios from 'axios';
import { toast } from 'react-hot-toast';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const api = axios.create({
baseURL: API_BASE_URL,
headers: {
'Content-Type': 'application/json',
},
timeout: 30000, // 30 seconds timeout
});
// Request interceptor to add auth token
api.interceptors.request.use(
(config) => {
const token = localStorage.getItem('token');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
},
(error) => {
return Promise.reject(error);
}
);
// Response interceptor for handling errors
api.interceptors.response.use(
(response) => {
return response;
},
async (error) => {
const originalRequest = error.config;
// Handle token expiration (401)
if (error.response?.status === 401 && !originalRequest._retry) {
originalRequest._retry = true;
try {
// Try to refresh token
const refreshToken = localStorage.getItem('refresh_token');
if (!refreshToken) {
throw new Error('No refresh token');
}
const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
refresh_token: refreshToken
});
const newToken = refreshResponse.data.access_token;localStorage.setItem('token', newToken);
// Retry original request with new token
originalRequest.headers.Authorization = `Bearer ${newToken}`;
return api(originalRequest);
} catch (refreshError) {
// Refresh failed, logout user
localStorage.removeItem('token');
localStorage.removeItem('refresh_token');
localStorage.removeItem('user');
if (window.location.pathname !== '/login') {
window.location.href = '/login';
}
return Promise.reject(refreshError);
}
}
// Handle other errors
const message = error.response?.data?.message || error.message || 'An error occurred';
// Don't show toast for 401 (handled above) or validation errors
if (error.response?.status !== 401 && error.response?.status !== 400) {
toast.error(message);
}
return Promise.reject(error);
}
);
export default api;