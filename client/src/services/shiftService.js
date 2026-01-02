import api from '../utils/api';
const shiftService = {
// Get today's shift for the logged-in doctor
getTodayShift: async () => {
const response = await api.get('/doctor/shifts/current');
return response.data;
},
// Get shift history
getShiftHistory: async (params = {}) => {
const response = await api.get('/doctor/shifts', { params });
return response.data;
},
// Get shift statistics
getStatistics: async () => {
const response = await api.get('/doctor/shifts/statistics');
return response.data;
},
// Check in to a shift
checkIn: async (shiftId, data = {}) => {
const response = await api.post(`/doctor/shifts/${shiftId}/checkin`, data);
return response.data;
},
// Check out from a shift
checkOut: async (shiftId, data = {}) => {
const response = await api.post(`/doctor/shifts/${shiftId}/checkout`, data);
return response.data;
},// Get attendance history
getAttendanceHistory: async (params = {}) => {
const response = await api.get('/doctor/attendance/history', { params });
return response.data;
},
// HR Admin: Get all shifts
getAllShifts: async (params = {}) => {
const response = await api.get('/shifts', { params });
return response.data;
},
// HR Admin: Create a shift
createShift: async (data) => {
const response = await api.post('/shifts', data);
return response.data;
},
// HR Admin: Bulk create shifts
bulkCreateShifts: async (data) => {
const response = await api.post('/shifts/bulk', data);
return response.data;
},
// HR Admin: Update a shift
updateShift: async (shiftId, data) => {
const response = await api.put(`/shifts/${shiftId}`, data);
return response.data;
},
// HR Admin: Delete a shift
deleteShift: async (shiftId) => {
const response = await api.delete(`/shifts/${shiftId}`);
return response.data;
},
// HR Admin: Assign doctor to shift
assignDoctor: async (shiftId, doctorId) => {
const response = await api.post(`/shifts/${shiftId}/assign`, { doctor_id: doctorIId });
return response.data;
},
// HR Admin: Reassign doctor
reassignDoctor: async (shiftId, doctorId) => {
const response = await api.put(`/shifts/${shiftId}/reassign`, { doctor_id: doctorId });
return response.data;
},
// HR Admin: Manual override
manualOverride: async (shiftId, data) => {
const response = await api.post(`/shifts/${shiftId}/override`, data);
return response.data;
},
// Get live dashboard data
getLiveDashboard: async () => {
const response = await api.get('/dashboard/live');
return response.data;
},
// Get dashboard metrics
getDashboardMetrics: async () => {
const response = await api.get('/dashboard/metrics');
return response.data;
}
};
export default shiftService;