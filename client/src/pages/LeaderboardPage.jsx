import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Users } from 'lucide-react';
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
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-elevated border border-bg-border">
          {index === 0 ? <Crown size={16} className="text-warning" /> :
           index === 1 ? <Medal size={16} className="text-gray-300" /> :
           index === 2 ? <Medal size={16} className="text-orange-400" /> :
           <span className="text-xs font-bold font-mono">{index + 1}</span>}
        </div>
      )
    },
    {
      header: 'Capitalist',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold border border-accent/10">
            {row.avatar || row.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{row.name}</p>
            <p className="text-[10px] text-text-muted font-mono tracking-tighter uppercase">{row.userId.substring(0, 8)}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Net Balance',
      render: (row) => (
        <span className="text-sm font-bold font-mono text-accent">
          {formatCurrency(row.netBalance)}
        </span>
      )
    },
    {
      header: 'Flow',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-income">
            <TrendingUp size={10} /> {formatCurrency(row.totalIncome)}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-expense">
            <TrendingDown size={10} /> {formatCurrency(row.totalExpenses)}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight italic uppercase">
            Leader<span className="text-accent underline underline-offset-8 decoration-accent/30 tracking-normal not-italic">Board</span>
          </h1>
          <p className="text-text-secondary mt-2">Global ranking of high-performance accounts by net balance.</p>
        </div>
        <Card className="py-4 px-6 border-accent/20 bg-accent/5 flex items-center gap-4">
          <Trophy className="text-accent" size={32} />
          <div>
            <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest leading-none">System Top Account</p>
            <p className="text-xl font-display font-bold text-white truncate max-w-[150px]">{data[0]?.name || '---'}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.slice(0, 3).map((user, i) => (
          <Card key={user.userId} className={`border-bg-border relative overflow-hidden ${i === 0 ? 'ring-2 ring-warning/30 bg-warning/5' : ''}`}>
             <div className="flex items-center gap-4 relative z-10">
                <div className={`p-4 rounded-2xl bg-bg-elevated ${i === 0 ? 'text-warning' : i === 1 ? 'text-gray-300' : 'text-orange-400'}`}>
                   {i === 0 ? <Crown size={32} /> : <Trophy size={32} />}
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase text-text-muted">Tier {i + 1} Executive</p>
                   <h3 className="text-xl font-bold text-white">{user.name}</h3>
                   <p className="text-sm font-bold text-accent font-mono mt-1">{formatCurrency(user.netBalance)}</p>
                </div>
             </div>
             {i === 0 && <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12"><Crown size={120} /></div>}
          </Card>
        ))}
      </div>

      <Card noPadding title="Wall of Fame" subtitle="Detailed ranking of authenticated users">
        <Table 
          columns={columns} 
          data={data} 
          loading={loading} 
          emptyMessage="No accounts ranked yet."
        />
      </Card>
    </div>
  );
};

export default LeaderboardPage;
