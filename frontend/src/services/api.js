import axios from 'axios';

const BASE_URL = 'http://localhost:8090/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API
export const authApi = {
  login: (credentials) => api.post('/login', credentials),
  signup: (userData) => api.post('/signup', userData),
  logout: () => api.post('/logout'),
};

// User API
export const userApi = {
  getAllUsers: (userId) => api.get('/admin/users', { params: { userId } }),
  getUserById: (id) => api.get(`/users/${id}`),
  saveUser: (userData) => api.post('/admin/users', userData),
  deleteUser: (id, userId) => api.delete(`/admin/users/${id}`, { params: { userId } }),
};

// Training API
export const trainingApi = {
  getAllTrainings: (userId) => api.get('/admin/trainings', { params: { userId } }),
  getTrainingById: (id) => api.get(`/training/${id}`),
  saveTraining: (trainingData) => api.post('/admin/trainings', trainingData),
  updateTraining: (id, trainingData) => api.put(`/admin/trainings/${id}`, trainingData),
  deleteTraining: (id, userId) => api.delete(`/admin/trainings/${id}`, { params: { userId } }),
  
  // Public training endpoints
  getActiveTrainings: (userId) => api.get('/trainings', { params: { status: 'active', userId } }),
  getAllUserTrainings: (userId) => api.get('/trainings', { params: { userId } }),
};

// User Dashboard API
export const userDashboardApi = {
  getAvailableTrainings: (status) => api.get('/user/trainings', { params: { status } }),
  enrollInTraining: (userId, trainingId) => api.post('/user/enroll', { userId: String(userId), trainingId: String(trainingId) }),
  getMyEnrollments: (userId) => api.get('/user/my-enrollments', { params: { userId } }),
  cancelEnrollment: (userId, trainingId) => api.delete('/user/cancel-enrollment', { 
    data: { userId: String(userId), trainingId: String(trainingId) }
  }),
};

// Allocation API (Admin only)
export const allocationApi = {
  getAllAllocations: (userId) => api.get('/admin/allocations', { params: { userId } }),
  deleteAllocation: (id, userId) => api.delete(`/admin/allocations/${id}`, { params: { userId } }),
};

export default api;