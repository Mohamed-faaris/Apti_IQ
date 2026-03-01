export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SUBJECTS: '/subjects',
  CHAPTERS: '/subjects/:id/chapters',
  LESSONS: '/chapters/:id/lessons',
  LESSON_DETAIL: '/lessons/:id',
  TEST: '/test',
  TEST_RESULTS: '/test/:id/results',
  LEADERBOARD: '/leaderboard',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  ADMIN: '/admin',
} as const;

export const QUERY_KEYS = {
  SUBJECTS: 'subjects',
  CHAPTERS: 'chapters',
  LESSONS: 'lessons',
  DASHBOARD: 'dashboard',
  LEADERBOARD: 'leaderboard',
  ANALYTICS: 'analytics',
  PROFILE: 'profile',
  TEST: 'test',
  TOURNAMENTS: 'tournaments',
} as const;

export const MAX_VIOLATIONS = 3;
export const MOCK_API_DELAY = 500;
export const LEADERBOARD_UPDATE_INTERVAL = 5000;
