import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import DataTable from '../components/ui/DataTable';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { User, TrendingUp, DollarSign, Activity, ArrowRight, ShieldCheck, Zap, Globe, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { Link } from 'react-router-dom';

const TopInvestorsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopInvestors = async () => {
      try {
        const res = await dashboardApi.getTopInvestors();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopInvestors();
  }, []);

  const columns = [
    {
      header: 'Investor Identity',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-btn bg-bg-base border border-bg-border flex items-center justify-center text-text-primary font-bold">
            <User size={20} className="text-text-dim" />
          </div>
          <div>
            <p className="text-[0.875rem] font-bold text-text-primary tracking-tight">{row.name}</p>
            <p className="text-[10px] text-text-dim font-mono uppercase tracking-tight">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Equity Position',
      render: (row) => (
        <div className="flex flex-col">
            <span className="text-[0.875rem] font-bold text-accent-teal tracking-tight">{formatCurrency(row.totalInvested)}</span>
            <span className="text-[10px] text-text-dim font-bold uppercase tracking-widest">{row.count} Asset Movements</span>
        </div>
      )
    },
    {
        header: 'Risk Profile',
        render: (row) => (
            <Badge variant="teal" outline className="border-accent-teal/30 text-accent-teal font-extrabold">AGGRESSIVE_GROWTH</Badge>
        )
    },
    {
      header: 'Governance',
      className: 'text-right',
      render: (row) => (
        <Link to={`/profile/${row.userId}`} className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-btn bg-bg-base border border-bg-border text-text-dim hover:text-accent-teal hover:border-accent-teal/40 text-[0.65rem] font-bold uppercase tracking-widest transition-all group shadow-sm">
            Audit Ledger <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-10 pb-20 animate-in">
      {/* Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-teal mb-1 block">Equity Intelligence</span>
           <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Active Capital Velocity</h1>
           <p className="text-sm text-text-dim font-medium mt-2 max-w-xl">
             High-fidelity analysis of the most active high-equity accounts and capital movement protocols.
           </p>
        </div>
        <div className="bg-bg-surface border border-bg-border p-5 rounded-lg flex items-center gap-4 shadow-card">
           <div className="p-3 rounded-btn bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
              <TrendingUp size={24} />
           </div>
           <div>
              <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest leading-none mb-1">Global Portfolio Avg</p>
              <h3 className="text-lg font-bold text-text-primary tracking-tighter">
                {data.length > 0 ? formatCurrency(data.reduce((acc, curr) => acc + curr.totalInvested, 0) / data.length) : 'N/A'}
              </h3>
           </div>
        </div>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard 
            label="Monitored Nodes" 
            value={data.length} 
            icon={Globe} 
            variant="blue" 
            delta="Active now"
            isCurrency={false}
         />
         <div className="md:col-span-3 bg-bg-surface border border-bg-border rounded-lg p-6 flex items-center justify-between relative overflow-hidden group shadow-card">
              <div className="flex items-center gap-6 relative z-10">
                 <div className="p-4 rounded-btn bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                    <ShieldCheck size={24} />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest mb-1">Intelligence Status</p>
                    <h3 className="text-lg font-bold text-text-primary tracking-tight">Delta-Tracking active for Institutional Analysts</h3>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-accent-teal flex items-center gap-2">
                       <Zap size={10} className="animate-pulse" /> Sychronized with mainnet node
                    </p>
                 </div>
              </div>
              <div className="hidden md:block opacity-5 group-hover:opacity-10 transition-opacity absolute right-0">
                 <Wallet size={120} strokeWidth={1} />
              </div>
         </div>
      </div>

      {/* Primary Ranking Terminal */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <Activity size={18} className="text-accent-teal" />
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-text-primary">High Equity Holders Registry</span>
        </div>
        
        <div className="rounded-lg border border-bg-border bg-bg-surface overflow-hidden shadow-card">
          <DataTable 
            columns={columns} 
            data={data} 
            loading={loading} 
          />
          <div className="px-8 py-4 border-t border-bg-border bg-bg-base/30 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-dim opacity-70">
            <span>Terminal: GAL-INVEST-0x</span>
            <span>Batch ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopInvestorsPage;
