import axios from 'axios';

// In development, connect directly to backend
// In production, set VITE_API_URL environment variable to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Departments
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getOne: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  search: (query) => api.get(`/departments/search?query=${query}`),
};

// Classes
export const classAPI = {
  getAll: (departmentId) => api.get('/classes', { params: { departmentId } }),
  getOne: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  search: (query, departmentId) => api.get('/classes/search', { params: { query, departmentId } }),
};

// Students
export const studentAPI = {
  getAll: (classId, departmentId) => api.get('/students', { params: { classId, departmentId } }),
  getOne: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  search: (query, classId, departmentId) => api.get('/students/search', { params: { query, classId, departmentId } }),
  getLedger: (id) => api.get(`/students/${id}/ledger`),
};

// Attendance
export const attendanceAPI = {
  mark: (data) => api.post('/attendance/mark', data),
  markBulk: (attendanceList) => api.post('/attendance/mark-bulk', { attendanceList }),
  getToday: (classId, departmentId) => api.get('/attendance/today', { params: { classId, departmentId } }),
  getStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  getClassSummary: (classId) => api.get(`/attendance/class/${classId}/summary`),
  getDepartmentSummary: (departmentId) => api.get(`/attendance/department/${departmentId}/summary`),
};

// Blockchain
export const blockchainAPI = {
  validate: () => api.get('/blockchain/validate'),
  getExplorer: (type) => api.get('/blockchain/explorer', { params: { type } }),
  getStats: () => api.get('/blockchain/stats'),
  getChain: (type, id) => api.get(`/blockchain/${type}/${id}`),
  getBlock: (type, id, blockIndex) => api.get(`/blockchain/${type}/${id}/block/${blockIndex}`),
};

export default api;
