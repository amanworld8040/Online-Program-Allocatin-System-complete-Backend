import axios from 'axios';

const BASE_URL = 'http://localhost:8090/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userApi = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  saveUser: (user) => api.post('/users', user),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Training API
export const trainingApi = {
  getAllTrainings: () => api.get('/training'),
  getTrainingById: (id) => api.get(`/training/${id}`),
  saveTraining: (training) => api.post('/training', training),
  deleteTraining: (id) => api.delete(`/training/${id}`),
};

// Allocation API
export const allocationApi = {
  getAllAllocations: () => api.get('/allocations'),
  getAllocationById: (id) => api.get(`/allocations/${id}`),
  saveAllocation: (allocation) => api.post('/allocations', allocation),
  deleteAllocation: (id) => api.delete(`/allocations/${id}`),
};

export default api;