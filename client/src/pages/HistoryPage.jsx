import React, { useState, useEffect, useCallback } from 'react';
import { transactionsApi } from '../api/transactions.api';
import DataTable from '../components/ui/DataTable';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import { formatDate, formatCurrency } from '../utils/formatters';
import { CreditCard, ShoppingBag, ArrowRightLeft, FileText, Download, Share2, History, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 12, type: 'expense' });

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
    const text = `TX_REF: ${transaction.id}\nDATE: ${formatDate(transaction.date)}\nTAXONOMY: ${transaction.category}\nVOLUME: ${formatCurrency(transaction.amount)}`;
    navigator.clipboard.writeText(text);
    toast.success('Ledger hash copied to clipboard');
  };

  const columns = [
    {
      header: 'Terminal Date',
      render: (row) => <span className="font-mono text-[11px] font-bold tracking-wider text-text-dim/80 uppercase">{formatDate(row.date)}</span>
    },
    {
      header: 'Entity / Taxonomy',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-btn bg-bg-base border border-bg-border text-text-dim"><ShoppingBag size={14} /></div>
          <span className="font-bold text-[0.875rem] tracking-tight text-text-primary">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Outflow Volume',
      render: (row) => (
        <span className="font-bold font-mono text-accent-red tracking-tight">
          -{formatCurrency(row.amount)}
        </span>
      )
    },
    {
      header: 'Protocol Hash',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Shield size={12} className="text-text-dim opacity-40" />
          <span className="text-[10px] font-mono font-bold text-text-dim uppercase tracking-tighter truncate max-w-[100px]">
            {row.id.toString(16).toUpperCase()}..X86
          </span>
        </div>
      )
    },
    {
      header: 'Governance',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end items-center gap-2">
            <button 
              onClick={() => handleShare(row)} 
              className="p-1.5 rounded-btn text-text-dim hover:text-accent-teal hover:bg-accent-teal/5 transition-all border border-transparent hover:border-accent-teal/20"
              title="Copy Reference"
            >
               <Share2 size={14} />
            </button>
            <button className="p-1.5 rounded-btn text-text-dim hover:text-white transition-all">
               <ArrowRightLeft size={14} />
            </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 pb-20 animate-in">
      {/* Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-red mb-1 block">Outbound Telemetry</span>
           <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Historical Distribution Ledger</h1>
           <p className="text-sm text-text-dim font-medium mt-2 max-w-xl">
             Comprehensive audit stream of all outbound financial flows and operational outlays.
           </p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => toast.success('Initializing bulk log export...')}
                className="flex items-center gap-2 bg-bg-surface border border-bg-border px-6 py-2.5 rounded-btn text-[0.65rem] font-bold text-text-dim hover:text-white transition-all group shadow-sm"
            >
                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> 
                EXPORT_LOG_CSV
            </button>
        </div>
      </div>

      {/* Governance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard 
            label="Total Interval Outflow" 
            value={data.reduce((acc, curr) => acc + curr.amount, 0)} 
            icon={CreditCard} 
            variant="red" 
            isHero 
            isNegative
         />
         <div className="md:col-span-3 bg-bg-surface border border-bg-border rounded-lg p-6 flex items-center justify-between relative overflow-hidden group shadow-card">
              <div className="flex items-center gap-6 relative z-10">
                 <div className="p-4 rounded-btn bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                    <FileText size={24} />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest leading-none mb-1">Audit Protocol</p>
                    <h3 className="text-lg font-bold text-text-primary tracking-tight">Sovereign Encryption Node Active</h3>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-accent-teal">Status: Nominal / Decrypted</p>
                 </div>
              </div>
              <div className="hidden md:block opacity-5 group-hover:opacity-10 transition-opacity absolute right-0">
                 <Zap size={100} strokeWidth={1} />
              </div>
         </div>
      </div>

      {/* Primary Registry Terminal */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <History size={18} className="text-accent-red" />
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-text-primary">Outbound Transaction Manifest</span>
        </div>
        
        <div className="rounded-lg border border-bg-border bg-bg-surface overflow-hidden shadow-card">
          <DataTable 
            columns={columns} 
            data={data} 
            loading={loading} 
          />
          <div className="px-8 py-4 border-t border-bg-border bg-bg-base/30 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim opacity-70">
              Audit Node: GALILEO-HIST-09
            </span>
            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.totalPages} 
              onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
