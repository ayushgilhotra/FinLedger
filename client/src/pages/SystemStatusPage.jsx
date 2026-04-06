import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Activity, Database, Server, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

const SystemStatusPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/health`);
      setData(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Unable to connect to the backend system.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-accent/5 blur-[150px]" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Shield size={14} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Diagnostic Console</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">System Status</h1>
            <p className="text-text-secondary mt-2">Real-time integrity check of the FinLedger core infrastructure.</p>
          </div>
          <Button onClick={fetchStatus} loading={loading} variant="secondary" className="bg-bg-elevated border-bg-border text-white">
            <RefreshCw size={18} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
            Recalibrate System
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Status */}
          <Card title="Infrastructure Nodes">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-base border border-bg-border/50">
                <div className="flex items-center gap-3">
                  <Server size={20} className={error ? 'text-expense' : 'text-accent'} />
                  <div>
                    <p className="text-sm font-bold">API Gateway</p>
                    <p className="text-xs text-text-muted">Load Balanced Cluster v1.0.4</p>
                  </div>
                </div>
                {error ? (
                  <div className="flex items-center gap-1 text-expense bg-expense/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Disconnected <AlertCircle size={10} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-income bg-income/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Operational <CheckCircle2 size={10} />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-base border border-bg-border/50">
                <div className="flex items-center gap-3">
                  <Database size={20} className={data ? 'text-accent' : 'text-text-muted'} />
                  <div>
                    <p className="text-sm font-bold">Database Cluster</p>
                    <p className="text-xs text-text-muted">MongoDB Atlas - Replica Set</p>
                  </div>
                </div>
                {data ? (
                  <div className="flex items-center gap-1 text-income bg-income/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Connected <CheckCircle2 size={10} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-text-muted bg-bg-elevated px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Idle
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Diagnostic Metrics */}
          <Card title="Real-time Metrics" subtitle="Core ledger synchronization metrics">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 animate-pulse">
                <Activity size={40} className="text-text-muted mb-4" />
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Retrieving Integrity Data...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle size={40} className="text-expense mb-4" />
                <p className="text-sm font-bold text-expense">Communication Break</p>
                <p className="text-xs text-text-secondary mt-2 px-6">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-bg-base border border-bg-border/50">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Vault Income</p>
                  <p className="text-lg font-bold text-income">{formatCurrency(data?.metrics?.totalIncome)}</p>
                </div>
                <div className="p-4 rounded-xl bg-bg-base border border-bg-border/50">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Ledger Expenses</p>
                  <p className="text-lg font-bold text-expense">{formatCurrency(data?.metrics?.totalExpenses)}</p>
                </div>
                <div className="p-4 rounded-xl bg-bg-base border border-bg-border/50 col-span-2">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Net System Balance</p>
                  <p className="text-lg font-bold text-accent">{formatCurrency(data?.metrics?.netBalance)}</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="text-center">
          <p className="text-xs text-text-muted mb-4 uppercase tracking-[0.2em]">Diagnostic Session Hash: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
          <a href="/login" className="text-sm font-bold text-accent hover:underline">Return to Secured Terminal</a>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPage;
