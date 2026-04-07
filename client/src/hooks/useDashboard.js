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
      console.log('📡 Synchronizing dashboard telemetry...');
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
      console.log('✅ Telemetry sync complete');
    } catch (err) {
      console.error('❌ CRITICAL: Dashboard telemetry sync failed', {
        error: err.message,
        details: err.response?.data || 'No response data',
        status: err.response?.status
      });
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
