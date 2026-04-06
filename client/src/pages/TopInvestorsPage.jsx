import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { User, TrendingUp, DollarSign, Activity, ArrowRight } from 'lucide-react';
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
      header: 'Investor Profile',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-3xl bg-accent/20 flex items-center justify-center text-accent font-bold border border-accent/10">
            {row.avatar || row.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase italic tracking-tight">{row.name}</p>
            <p className="text-[10px] text-text-muted font-mono">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Equity Position',
      render: (row) => (
        <div className="flex flex-col">
            <span className="text-sm font-bold text-income">{formatCurrency(row.totalInvested)}</span>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{row.count} Asset Movements</span>
        </div>
      )
    },
    {
        header: 'Risk Profile',
        render: (row) => (
            <Badge variant="active" dot className="bg-income/10 text-income hover:bg-income/20">High Growth</Badge>
        )
    },
    {
      header: 'Action',
      render: (row) => (
        <Link to={`/profile/${row.userId}`}>
          <button className="flex items-center gap-2 p-2 hover:bg-accent/10 rounded-lg text-accent text-xs font-bold transition-colors">
            Open Ledger <ArrowRight size={14} />
          </button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight italic uppercase">
            Top<span className="text-accent underline underline-offset-8 decoration-accent/30 tracking-normal not-italic">Investors</span>
          </h1>
          <p className="text-text-secondary mt-2">Analysis of the most active high-equity accounts in the system.</p>
        </div>
        <Card className="py-4 px-6 border-income/20 bg-income/5 flex items-center gap-4">
          <TrendingUp className="text-income" size={32} />
          <div>
            <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest leading-none">Global Portfolio Avg</p>
            <p className="text-xl font-display font-bold text-white">
                {data.length > 0 ? formatCurrency(data.reduce((acc, curr) => acc + curr.totalInvested, 0) / data.length) : '---'}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="flex flex-col items-center justify-center text-center py-6 border-bg-border">
            <DollarSign className="text-accent mb-2" size={24} />
            <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Active Investors</p>
            <h3 className="text-xl font-bold text-white">{data.length} Nodes</h3>
         </Card>
         <Card className="flex flex-col items-center justify-center text-center py-6 col-span-3 border-accent/20">
             <div className="flex items-center gap-6">
                <Activity size={32} className="text-accent animate-pulse" />
                <div className="text-left">
                   <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest leading-none mb-1">System Intelligence Status</p>
                   <h3 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Real-time portfolio delta tracking active for Analysts</h3>
                </div>
             </div>
         </Card>
      </div>

      <Card noPadding title="High Equity Holders" subtitle="Top 10 users by 'Investment' category volume">
        <Table 
          columns={columns} 
          data={data} 
          loading={loading} 
          emptyMessage="No investors identified yet."
        />
      </Card>
    </div>
  );
};

export default TopInvestorsPage;
