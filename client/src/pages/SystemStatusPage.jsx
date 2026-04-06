import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Shield, Activity, Database, Server, RefreshCw, AlertCircle, CheckCircle2, Cpu, ChevronRight, HardDrive, Network, Zap } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';
import { Link } from 'react-router-dom';

const SystemStatusPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalibrating, setRecalibrating] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard/health');
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.error || 'Identity Connection Failure');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalibrate = async () => {
    setRecalibrating(true);
    const toastId = toast.loading('Recalibrating Intelligence Nodes...');
    try {
      await api.post('/dashboard/recalibrate');
      toast.success('System Intelligence Recalibrated', { id: toastId });
      fetchStatus();
    } catch (err) {
      console.error(err);
      toast.error('Recalibration Terminated: ' + (err.error || 'Unknown'), { id: toastId });
    } finally {
      setRecalibrating(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const nodes = [
    { label: 'API Gateway', desc: 'Load Balanced Cluster v1.0.4', active: !error, icon: Server },
    { label: 'Database Cluster', desc: 'MongoDB Atlas - Replica Set', active: !!data, icon: Database },
    { label: 'Intelligence Engine', desc: 'Neural Ledger Processor', active: true, icon: Cpu },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in">
      {/* Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-teal mb-1 block">Infrastructure Layer</span>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">System Integrity Monitor</h1>
          <p className="text-sm text-text-dim font-medium mt-2 max-w-xl">
            Real-time telemetry of the FinLedger institutional-grade decentralized infrastructure.
          </p>
        </div>
        <Button 
          onClick={handleRecalibrate} 
          loading={recalibrating} 
          className="h-12 px-8 shadow-teal-glow"
        >
          <RefreshCw size={18} className={recalibrating ? 'animate-spin mr-3' : 'mr-3'} />
          Recalibrate Intelligence
        </Button>
      </div>

      {/* Critical Infrastructure Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Gross Network Throughput" 
          value={data?.metrics?.totalIncome || 0} 
          icon={Zap} 
          variant="teal" 
          isHero 
        />
        <StatCard 
          label="Operational Latency" 
          value={data?.metrics?.totalExpenses || 0} 
          icon={Activity} 
          variant="amber" 
          delta="12ms avg baseline"
        />
        <StatCard 
          label="Sovereign Ledger Assets" 
          value={data?.metrics?.netBalance || 0} 
          icon={Shield} 
          variant="blue" 
        />
      </div>

      {/* Node Status & Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Network size={18} className="text-accent-teal" />
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-text-primary">Cluster Node Distribution</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nodes.map((node, i) => (
              <div key={i} className="bg-bg-surface border border-bg-border p-6 rounded-lg shadow-card group hover:border-accent-teal/30 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-btn ${node.active ? 'bg-accent-teal/10 text-accent-teal' : 'bg-bg-base text-text-dim'}`}>
                    <node.icon size={24} />
                  </div>
                  <Badge variant={node.active ? 'teal' : 'red'}>
                    {node.active ? 'NOMINAL' : 'OFFLINE'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-text-primary">{node.label}</h3>
                  <p className="text-[0.7rem] font-bold uppercase tracking-wider text-text-dim">{node.desc}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-bg-border flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-widest text-text-dim/60">
                   <span>Node ID: GAL-PRX-0{i+1}</span>
                   <span>Uptime: 99.9%</span>
                </div>
              </div>
            ))}
            
            {/* Expansion Card */}
            <div className="bg-bg-base border border-dashed border-bg-border p-6 rounded-lg flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-all cursor-pointer group">
              <div className="h-12 w-12 rounded-full border-2 border-dashed border-bg-border flex items-center justify-center text-text-dim group-hover:text-accent-teal group-hover:border-accent-teal transition-all mb-4">
                <Plus size={20} />
              </div>
              <span className="text-[0.7rem] font-bold uppercase tracking-widest text-text-dim">Provision Node</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Activity size={18} className="text-accent-blue" />
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-text-primary">Event Stream</span>
          </div>

          <div className="bg-bg-surface border border-bg-border rounded-lg shadow-card overflow-hidden">
            <div className="p-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-bg-border last:border-0 last:pb-0">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent-teal shadow-teal-glow animate-pulse shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[0.75rem] font-bold text-text-primary">Audit Cycle {842+i} Initialized</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim opacity-70">
                      Timestamp: {1200 + i*15}ms offset
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-bg-base/50 text-center">
              <button className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent-blue hover:text-white transition-colors">
                Decrypt Full Log
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-10">
        <Link to="/login" className="group inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-text-dim hover:text-white transition-all">
          <ChevronRight size={18} className="rotate-180" />
          Access Terminal
        </Link>
      </div>
    </div>
  );
};

const Plus = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default SystemStatusPage;
