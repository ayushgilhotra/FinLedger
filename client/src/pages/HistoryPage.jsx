import React, { useState, useEffect, useCallback } from 'react';
import { transactionsApi } from '../api/transactions.api';
import Table from '../components/ui/Table';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import { formatDate, formatCurrency } from '../utils/formatters';
import { CreditCard, ShoppingBag, ArrowRightLeft, FileText, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, type: 'expense' });

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await transactionsApi.getTransactions(filters);
      setData(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleShare = (transaction) => {
    const text = `ID: ${transaction.id}\nDate: ${formatDate(transaction.date)}\nCategory: ${transaction.category}\nAmount: ${formatCurrency(transaction.amount)}`;
    navigator.clipboard.writeText(text);
    toast.success('Log copied for sharing');
  };

  const columns = [
    {
      header: 'Terminal Date',
      render: (row) => <span className="font-mono text-xs">{formatDate(row.date)}</span>
    },
    {
      header: 'Payee Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-bg-elevated text-text-muted"><ShoppingBag size={14} /></div>
          <span className="font-bold text-sm tracking-tight">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Amount Out',
      render: (row) => (
        <span className="text-sm font-bold font-mono text-expense">
          -{formatCurrency(row.amount)}
        </span>
      )
    },
    {
      header: 'Reference Hash',
      render: (row) => <span className="text-[10px] font-mono text-text-muted truncate max-w-[80px]">{row.id.substring(0, 12)}...</span>
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
            <button onClick={() => handleShare(row)} className="p-2 hover:bg-accent/10 rounded-lg text-text-muted hover:text-accent transition-colors" title="Share Log">
               <Share2 size={14} />
            </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight italic uppercase">
            Payment<span className="text-expense underline underline-offset-8 decoration-expense/30 tracking-normal not-italic">History</span>
          </h1>
          <p className="text-text-secondary mt-2">Comprehensive audit log of all outbound financial flows (Expenses).</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => toast.success('Beginning Bulk Download...')}
                className="flex items-center gap-2 bg-bg-elevated border border-bg-border px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-white transition-colors"
            >
                <Download size={14} /> Export Logs (CSV)
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="md:col-span-1 border-expense/20 bg-expense/5">
            <CreditCard className="text-expense mb-2" size={24} />
            <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Total Outflow</p>
            <h3 className="text-xl font-bold font-mono text-expense">
                {data.length > 0 ? formatCurrency(data.reduce((acc, curr) => acc + curr.amount, 0)) : '---'}
            </h3>
         </Card>
         <Card className="md:col-span-3">
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-bg-elevated text-info"><FileText size={24} /></div>
                <div>
                   <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest leading-none mb-1">Audit Status</p>
                   <h3 className="text-lg font-bold text-text-primary">Authenticated Ledger Logging Active</h3>
                </div>
             </div>
         </Card>
      </div>

      <Card noPadding>
        <Table 
          columns={columns} 
          data={data} 
          loading={loading} 
          emptyMessage="No payment logs recorded."
        />
        <div className="px-6 border-t border-bg-border">
          <Pagination 
            currentPage={pagination.page} 
            totalPages={pagination.totalPages} 
            onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
          />
        </div>
      </Card>
    </div>
  );
};

export default HistoryPage;
