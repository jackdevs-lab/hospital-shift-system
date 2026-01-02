import api from '../utils/api';
const authService = {
login: async (email, password) => {const response = await api.post('/auth/login', { email, password });
return response.data;
},
logout: async () => {
const response = await api.post('/auth/logout');
return response.data;
},
refreshToken: async (refreshToken) => {
const response = await api.post('/auth/refresh', { refresh_token: refreshToken 
});
return response.data;
},
getProfile: async () => {
const response = await api.get('/auth/profile');
return response.data.user;
},
updateProfile: async (data) => {
const response = await api.put('/auth/profile', data);
return response.data.user;
},
forgotPassword: async (email) => {
const response = await api.post('/auth/forgot-password', { email });
return response.data;
},
resetPassword: async (token, password) => {
const response = await api.post('/auth/reset-password', { token, password });
return response.data;
}
};
export default authService;