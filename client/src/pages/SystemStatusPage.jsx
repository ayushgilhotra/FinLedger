import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Shield, Activity, Database, Server, RefreshCw, AlertCircle, CheckCircle2, Cpu, ChevronRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

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

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-10 md:p-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] h-[70%] w-[70%] rounded-full bg-accent/5 blur-[150px]" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[60%] w-[60%] rounded-full bg-indigo-500/5 blur-[150px]" />
      
      <div className="max-w-6xl mx-auto space-y-16 relative z-10 animate-in fade-in duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/10 mb-2">
              <Shield size={16} className="text-accent" strokeWidth={3} />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Root Diagnostic Mode</span>
            </div>
            <h1 className="text-6xl font-display font-black text-white tracking-tighter uppercase italic">
              System <span className="text-accent">Integrity</span>
            </h1>
            <p className="text-text-secondary text-lg font-black uppercase tracking-widest max-w-2xl">Real-time telemetry of the FinLedger infrastructure layer.</p>
          </div>
          <Button 
            onClick={handleRecalibrate} 
            loading={recalibrating} 
            className="h-16 shadow-neon"
          >
            <RefreshCw size={20} className={recalibrating ? 'animate-spin mr-3' : 'mr-3'} strokeWidth={3} />
            Initialize Recalibration
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Infrastructure status grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card variant="glass" className="rounded-[3rem] p-4 border-white/10 shadow-2xl" title="Infrastructure Nodes" subtitle="Live cluster status monitor">
              <div className="space-y-6 pt-4">
                {[
                    { label: 'API Gateway', desc: 'Load Balanced Cluster v1.0.4', active: !error, icon: Server },
                    { label: 'Database Cluster', desc: 'MongoDB Atlas - Replica Set', active: !!data, icon: Database },
                    { label: 'Intelligence Engine', desc: 'Neural Ledger Processor', active: true, icon: Cpu },
                ].map((node, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-300 group">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "p-4 rounded-2xl transition-all duration-500",
                                node.active ? "bg-accent/10 text-accent group-hover:scale-110" : "bg-bg-elevated text-text-muted"
                            )}>
                                <node.icon size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-white">{node.label}</p>
                                <p className="text-[10px] font-black uppercase tracking-tight text-text-secondary mt-0.5">{node.desc}</p>
                            </div>
                        </div>
                        {node.active ? (
                            <div className="flex items-center gap-2 text-income px-4 py-1.5 rounded-full bg-income/10 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
                                NOMINAL <CheckCircle2 size={12} strokeWidth={3} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-expense px-4 py-1.5 rounded-full bg-expense/10 text-[9px] font-black uppercase tracking-[0.2em]">
                                OFFLINE <AlertCircle size={12} strokeWidth={3} />
                            </div>
                        )}
                    </div>
                ))}
              </div>
            </Card>

            <Card variant="glass" className="rounded-[3rem] p-4 border-white/10 shadow-2xl" title="Real-time Telemetry" subtitle="Financial through-put analysis">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
                        <Activity size={60} className="text-accent opacity-20" strokeWidth={3} />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted">Analyzing Streams...</span>
                    </div>
                ) : (
                    <div className="space-y-8 pt-4">
                        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                             <p className="text-[11px] font-black text-text-secondary uppercase tracking-[0.3em]">Gross Network Volume</p>
                             <p className="text-4xl font-display font-black text-income tabular-nums tracking-tighter">{formatCurrency(data?.metrics?.totalIncome || 0)}</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                             <p className="text-[11px] font-black text-text-secondary uppercase tracking-[0.3em]">Operational Outflow</p>
                             <p className="text-4xl font-display font-black text-expense tabular-nums tracking-tighter">{formatCurrency(data?.metrics?.totalExpenses || 0)}</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-accent/5 border border-accent/20 space-y-2">
                             <p className="text-[11px] font-black text-accent uppercase tracking-[0.3em]">Net Ledger Gravity</p>
                             <p className="text-4xl font-display font-black text-white tabular-nums tracking-tighter shadow-neon">{formatCurrency(data?.metrics?.netBalance || 0)}</p>
                        </div>
                    </div>
                )}
            </Card>
          </div>

          <Card variant="glass" className="rounded-[3rem] border-white/10 p-4" title="Event Horizon" subtitle="Recent infrastructure events">
             <div className="space-y-4 pt-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white">Consolidated Audit {i+1}</p>
                            <p className="text-[9px] font-black uppercase tracking-tight text-text-secondary opacity-70">Timestamp: Node_X{i+100}</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-accent shadow-neon animate-pulse" />
                    </div>
                ))}
                <div className="pt-6">
                    <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">Diagnostic Key</p>
                        <p className="text-xs font-mono font-black text-indigo-400 tracking-tighter uppercase">{Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
                    </div>
                </div>
             </div>
          </Card>
        </div>

        <div className="text-center pt-10">
          <Link to="/login" className="group inline-flex items-center gap-4 text-sm font-black uppercase tracking-[0.3em] text-text-muted hover:text-white transition-all duration-500">
             Return to Access Terminal <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const cn = (...inputs) => inputs.filter(Boolean).join(' ');

// Dummy Link for component context
const Link = ({ to, children, className }) => <a href={to} className={className}>{children}</a>;

export default SystemStatusPage;
