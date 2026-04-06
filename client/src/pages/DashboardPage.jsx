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
      header: 'Date', 
      accessor: 'date',
      render: (row) => <span className="font-mono text-xs">{formatDate(row.date)}</span>
    },
    { 
      header: 'Category', 
      accessor: 'category',
      render: (row) => <span className="font-bold tracking-tight">{row.category}</span>
    },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (row) => (
        <Badge variant={row.type}>{row.type}</Badge>
      )
    },
    { 
      header: 'Amount', 
      accessor: 'amount', 
      render: (row) => (
        <span className={row.type === 'income' ? 'text-income font-semibold tabular-nums tracking-normal' : 'text-expense font-semibold tabular-nums tracking-normal'}>
          {row.type === 'income' ? '+' : '-'}{formatCurrency(row.amount)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Actions */}
      <div className="flex justify-end">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={fetchAll} 
          loading={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
          Synchronize Data
        </Button>
      </div>

      {/* Summary Row */}
      <SummaryCards summary={summary} loading={loading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card title="Revenue vs Expenses" className="lg:col-span-3 h-full" noPadding>
          <div className="p-6 pb-0">
            <TrendChart data={trends} />
          </div>
        </Card>
        
        <Card title="Allocation by Category" className="lg:col-span-2 h-full" noPadding>
          <div className="p-6">
            <CategoryChart data={categories} />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card 
        title="Recent Activity" 
        subtitle="Your latest 10 transactions"
        action={
          <Link to="/transactions">
            <Button variant="ghost" size="sm" className="font-bold text-accent">
              View Journal <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        }
        noPadding
      >
        <Table 
          columns={recentColumns} 
          data={recent} 
          loading={loading} 
          emptyMessage="No recent transactions found"
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
