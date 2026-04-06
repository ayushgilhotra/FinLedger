import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import DataTable from '../components/ui/DataTable';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Users, Target, Zap, Shield, User } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const LeaderboardPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await dashboardApi.getLeaderboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const columns = [
    {
      header: 'Rank',
      render: (row, index) => (
        <div className={`flex items-center justify-center w-8 h-8 rounded-btn font-mono font-bold text-xs border ${
          index === 0 ? 'bg-accent-teal/20 border-accent-teal/40 text-accent-teal' :
          index === 1 ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' :
          index === 2 ? 'bg-accent-amber/10 border-accent-amber/20 text-accent-amber' :
          'bg-bg-base border-bg-border text-text-dim'
        }`}>
          {index + 1}
        </div>
      )
    },
    {
      header: 'Account Identity',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-btn bg-bg-base border border-bg-border flex items-center justify-center text-text-primary font-bold">
            <User size={18} className="text-text-dim" />
          </div>
          <div>
            <p className="text-[0.875rem] font-bold text-text-primary">{row.name}</p>
            <p className="text-[10px] text-text-dim font-mono tracking-tighter uppercase">{row.userId.substring(0, 8)}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Net Liquidity',
      render: (row) => (
        <span className="font-bold font-mono text-text-primary tracking-tight">
          {formatCurrency(row.netBalance)}
        </span>
      )
    },
    {
      header: 'Flow Velocity',
      render: (row, index) => (
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-accent-teal uppercase tracking-widest">
            <TrendingUp size={12} strokeWidth={3} /> {formatCurrency(row.totalIncome)}
          </div>
          <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-accent-red uppercase tracking-widest">
            <TrendingDown size={12} strokeWidth={3} /> {formatCurrency(row.totalExpenses)}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 pb-20 animate-in">
      {/* Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-teal mb-1 block">Network Performance</span>
           <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">High-Performance Matrix</h1>
           <p className="text-sm text-text-dim font-medium mt-2 max-w-xl">
             Global ranking of authenticated node operators based on cumulative liquidity and capital velocity.
           </p>
        </div>
        <div className="flex items-center gap-4 bg-bg-surface border border-bg-border p-4 rounded-lg shadow-sm">
           <div className="p-3 rounded-btn bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
              <Trophy size={24} />
           </div>
           <div>
              <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest leading-none mb-1">Matrix Leader</p>
              <h3 className="text-lg font-bold text-text-primary tracking-tight truncate max-w-[150px]">
                {data[0]?.name || 'N/A'}
              </h3>
           </div>
        </div>
      </div>

      {/* Top Producers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.slice(0, 3).map((user, i) => (
          <div key={user.userId} className={`bg-bg-surface border rounded-lg p-8 relative overflow-hidden group shadow-card ${i === 0 ? 'border-accent-teal/40 bg-accent-teal/5' : 'border-bg-border'}`}>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                   <div className={`p-4 rounded-btn border ${
                     i === 0 ? 'bg-accent-teal/20 border-accent-teal/40 text-accent-teal' : 
                     i === 1 ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' : 
                     'bg-accent-amber/10 border-accent-amber/20 text-accent-amber'
                   }`}>
                      {i === 0 ? <Crown size={32} /> : i === 1 ? <Medal size={32} /> : <Target size={32} />}
                   </div>
                   <Badge variant={i === 0 ? 'teal' : 'blue'}>TIER_{i + 1}_ASSET_CLASS</Badge>
                </div>
                <div>
                   <h3 className="text-2xl font-extrabold text-text-primary tracking-tight">{user.name}</h3>
                   <div className="mt-4 pt-4 border-t border-bg-border/40 flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest">Net Valuation</p>
                        <p className={`text-xl font-bold font-mono tracking-tighter ${i === 0 ? 'text-accent-teal' : 'text-text-primary'}`}>
                          {formatCurrency(user.netBalance)}
                        </p>
                      </div>
                      <div className="h-10 w-10 opacity-20 group-hover:opacity-40 transition-opacity">
                         <Zap size={40} className={i === 0 ? 'text-accent-teal' : 'text-text-dim'} />
                      </div>
                   </div>
                </div>
             </div>
             {i === 0 && (
               <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:rotate-6 transition-transform">
                  <Shield size={160} strokeWidth={1} />
               </div>
             )}
          </div>
        ))}
      </div>

      {/* Primary Ranking Terminal */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <Zap size={18} className="text-accent-teal" />
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-text-primary">Performance Ranking Manifest</span>
        </div>
        
        <div className="rounded-lg border border-bg-border bg-bg-surface overflow-hidden shadow-card">
          <DataTable 
            columns={columns} 
            data={data} 
            loading={loading} 
          />
          <div className="px-8 py-4 border-t border-bg-border bg-bg-base/30 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-dim opacity-70">
            <span>Matrix Node: GAL-RANK-01</span>
            <span>Interval: Real-time Synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
