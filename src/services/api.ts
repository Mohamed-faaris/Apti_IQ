import axios from 'axios';
import { API_BASE_URL } from '../shared/constants';
import { mockApi } from './mockApi';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service - currently using mock, can be switched to real API
export const api = {
  auth: {
    login: mockApi.login,
    register: mockApi.register,
    logout: mockApi.logout,
  },
  dashboard: {
    getStats: mockApi.getDashboardStats,
  },
  subjects: {
    getAll: mockApi.getSubjects,
  },
  chapters: {
    getBySubject: mockApi.getChapters,
  },
  lessons: {
    getByChapter: mockApi.getLessons,
    getById: mockApi.getLesson,
    markComplete: mockApi.markLessonComplete,
  },
  tests: {
    getById: mockApi.getTest,
    submit: mockApi.submitTest,
    getResult: mockApi.getTestResult,
  },
  leaderboard: {
    get: mockApi.getLeaderboard,
  },
  analytics: {
    get: mockApi.getAnalytics,
  },
  profile: {
    get: mockApi.getProfile,
    update: mockApi.updateProfile,
  },
  tournaments: {
    getAll: mockApi.getTournaments,
    getById: mockApi.getTournament,
    register: mockApi.registerTournament,
  },
};
