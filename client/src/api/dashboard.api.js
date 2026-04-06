import api from './axios';

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getCategories: () => api.get('/dashboard/categories'),
  getTrends: () => api.get('/dashboard/trends'),
  getRecent: () => api.get('/dashboard/recent'),
  getLeaderboard: () => api.get('/dashboard/leaderboard'),
  getTopInvestors: () => api.get('/dashboard/top-investors'),
  getHealth: () => api.get('/dashboard/health'),
};
