import { useState, useCallback } from 'react';
import { dashboardApi } from '../api/dashboard.api';

export const useDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, catRes, trendRes, recRes] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getCategories(),
        dashboardApi.getTrends(),
        dashboardApi.getRecent(),
      ]);
      setSummary(sumRes.data);
      setCategories(catRes.data);
      setTrends(trendRes.data);
      setRecent(recRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    summary,
    categories,
    trends,
    recent,
    loading,
    fetchAll,
  };
};
