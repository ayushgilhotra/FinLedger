import React, { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import TrendChart from '../components/charts/TrendChart';
import CategoryChart from '../components/charts/CategoryChart';
import { formatDate, formatCurrency } from '../utils/formatters';
import DataTable from '../components/ui/DataTable';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { RefreshCw, ArrowRight, Wallet, Activity, TrendingUp, Shield, BarChart3, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { 
    summary, 
    categories, 
    trends, 
    recent, 
    loading, 
    fetchAll 
  } = useDashboard();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const recentColumns = [
    { 
      header: 'Settlement Date', 
      accessor: 'date',
      render: (row) => <span className="font-mono text-[11px] font-bold tracking-wider text-text-dim/80">{formatDate(row.date)}</span>
    },
    { 
      header: 'Entity / Category', 
      accessor: 'category',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant="blue" outline>{row.category}</Badge>
        </div>
      )
    },
    { 
      header: 'Protocol Status', 
      accessor: 'type',
      render: (row) => (
        <Badge variant={row.type === 'income' ? 'teal' : 'red'}>
          {row.type === 'income' ? 'CREDIT_OK' : 'DEBIT_VERIFIED'}
        </Badge>
      )
    },
    { 
      header: 'Transaction Volume', 
      accessor: 'amount', 
      className: 'text-right',
      render: (row) => (
        <span className={`font-bold tabular-nums tracking-tight ${row.type === 'income' ? 'text-accent-teal' : 'text-accent-red'}`}>
          {row.type === 'income' ? '+' : '-'}{formatCurrency(row.amount)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-10 pb-20 animate-in">
      {/* Telemetry Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-teal mb-1 block">Operational Telemetry</span>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Active Intelligence Overview</h1>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={fetchAll} 
          loading={loading}
          className="h-10 px-6 border-bg-border bg-bg-surface hover:bg-bg-elevated"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
          Sync Node Data
        </Button>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Managed Assets" 
          value={summary?.balance || 0} 
          delta="+4.2% since interval" 
          icon={Wallet} 
          variant="teal" 
          isHero 
        />
        <StatCard 
          label="Interval Gross Revenue" 
          value={summary?.income || 0} 
          delta="+12.4% vs prev week" 
          icon={TrendingUp} 
          variant="green" 
        />
        <StatCard 
          label="System Operational Expense" 
          value={summary?.expense || 0} 
          delta="-2.1% automated yield" 
          isNegative 
          icon={Activity} 
          variant="red" 
        />
      </div>

      {/* Data Visualization Cluster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-8 rounded-lg bg-bg-surface border border-bg-border shadow-card relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
                <BarChart3 size={18} className="text-accent-teal" />
                Capital Flow Engine
              </h3>
              <p className="text-xs text-text-dim font-medium uppercase tracking-widest mt-1">Real-time throughput analytics</p>
            </div>
            <Badge variant="blue" className="bg-accent-blue/5 border-accent-blue/20">LIVE_TELEMETRY</Badge>
          </div>
          <div className="h-[300px] w-full">
            <TrendChart data={trends} />
          </div>
        </div>
        
        <div className="lg:col-span-4 p-8 rounded-lg bg-bg-surface border border-bg-border shadow-card relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
                <PieChart size={18} className="text-accent-blue" />
                Resource Allocation
              </h3>
              <p className="text-xs text-text-dim font-medium uppercase tracking-widest mt-1">Portfolio sector density</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <CategoryChart data={categories} />
          </div>
        </div>
      </div>

      {/* Primary Ledger Terminal */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
              <Shield size={18} className="text-accent-teal" strokeWidth={2.5} />
              Verified Ledger Activity
            </h3>
            <p className="text-xs text-text-dim font-medium uppercase tracking-widest mt-1">Latest 10 transitions recorded on node</p>
          </div>
          <Link to="/transactions" className="group flex items-center gap-1.5 text-xs font-bold text-accent-teal hover:text-white transition-colors uppercase tracking-[0.15em]">
            Access Full Journal
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <DataTable 
          columns={recentColumns} 
          data={recent} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

export default DashboardPage;
