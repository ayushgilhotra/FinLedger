import React, { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import SummaryCards from '../components/charts/SummaryCards';
import TrendChart from '../components/charts/TrendChart';
import CategoryChart from '../components/charts/CategoryChart';
import { formatDate, formatCurrency } from '../utils/formatters';
import Table from '../components/ui/Table';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { RefreshCw, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
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
      render: (row) => <span className="font-mono text-xs font-black tracking-widest text-text-secondary uppercase">{formatDate(row.date)}</span>
    },
    { 
      header: 'Category Type', 
      accessor: 'category',
      render: (row) => <span className="font-black text-xs uppercase tracking-[0.1em] text-white">{row.category}</span>
    },
    { 
      header: 'System Status', 
      accessor: 'type',
      render: (row) => (
        <Badge variant={row.type}>{row.type}</Badge>
      )
    },
    { 
      header: 'Volume', 
      accessor: 'amount', 
      render: (row) => (
        <span className={cn(
          "font-mono text-sm font-black tabular-nums tracking-tighter",
          row.type === 'income' ? 'text-income' : 'text-expense'
        )}>
          {row.type === 'income' ? '+' : '-'}{formatCurrency(row.amount)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700 slide-in-from-bottom-4">
      {/* Header Actions */}
      <div className="flex justify-end">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={fetchAll} 
          loading={loading}
          className="border-white/10"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
          Synchronize Intelligence
        </Button>
      </div>

      {/* Summary Row */}
      <SummaryCards summary={summary} loading={loading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <Card title="Revenue Flow Engine" subtitle="Real-time transaction volume analytics" className="lg:col-span-3 h-full" noPadding variant="glass">
          <div className="p-10 pb-0">
            <TrendChart data={trends} />
          </div>
        </Card>
        
        <Card title="Capital Allocation" subtitle="Diversification porfolio by category" className="lg:col-span-2 h-full" noPadding variant="glass">
          <div className="p-10">
            <CategoryChart data={categories} />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card 
        title="Recent Ledger Activity" 
        subtitle="Latest 10 transactions verified by system"
        action={
          <Link to="/transactions">
            <Button variant="ghost" size="sm" className="font-black text-accent tracking-[0.2em] group">
              View Journal <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        }
        noPadding
      >
        <Table 
          columns={recentColumns} 
          data={recent} 
          loading={loading} 
          emptyMessage="No historical data found in the current cycle"
        />
      </Card>
    </div>
  );
};

const cn = (...inputs) => {
  return inputs.filter(Boolean).join(' ');
};

export default DashboardPage;
