import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { transactionsApi } from '../api/transactions.api';
import { useAuth } from '../hooks/useAuth';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import { formatDate, formatCurrency } from '../utils/formatters';
import { ChevronLeft, Edit, Trash, Calendar, Tag, CreditCard, FileText, Shield, Fingerprint, Activity, Clock, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTx = useCallback(async () => {
    try {
      const res = await transactionsApi.getTransactionById(id);
      setTransaction(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTx();
  }, [fetchTx]);

  const handleDelete = async () => {
    if (window.confirm('Permanent revocation of this ledger entry? This action is immutable.')) {
      try {
        await transactionsApi.deleteTransaction(id);
        toast.success('Ledger entry purged');
        navigate('/transactions');
      } catch (err) {
        console.error(err);
        toast.error('Purge request rejected by node');
      }
    }
  };

  const canModify = transaction && (
    user.role === 'admin' || (user.role === 'analyst' && transaction.user_id === user.id)
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-6">
      <div className="h-12 w-12 border-4 border-bg-border border-t-accent-teal rounded-full animate-spin" />
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-text-dim">Decrypting Ledger Entry...</span>
    </div>
  );

  if (!transaction) return (
    <div className="text-center py-40 space-y-6">
      <h2 className="text-2xl font-bold text-text-primary tracking-tight">Entry Not Found</h2>
      <p className="text-text-dim font-medium max-w-sm mx-auto">The requested transaction hash could not be retrieved from the active data shards.</p>
      <Link to="/transactions">
        <Button variant="secondary">Return to Journal</Button>
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in">
      <Link to="/transactions" className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-dim hover:text-accent-teal transition-all">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Secured Journal
      </Link>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-teal mb-1 block">Ledger Reference Hash</span>
          <h1 className="text-4xl font-extrabold text-text-primary tracking-tighter uppercase font-mono">
           TX_{transaction.id.toString().padStart(8, '0')}
          </h1>
        </div>
        <div className="flex gap-3">
          {canModify && (
            <>
              <Button variant="secondary" size="md" onClick={() => toast.success('Access the main terminal for modification')} className="h-11 px-6 border-bg-border bg-bg-surface">
                <Edit size={16} className="mr-2" /> Modify Entry
              </Button>
              <Button variant="ghost" size="md" onClick={handleDelete} className="h-11 px-6 text-accent-red hover:bg-accent-red/5">
                <Trash size={16} className="mr-2" /> Purge
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard 
          label="Settled Volume" 
          value={transaction.amount} 
          icon={CreditCard} 
          variant={transaction.type === 'income' ? 'teal' : 'red'} 
          isHero 
          isNegative={transaction.type !== 'income'}
        />
        <div className="bg-bg-surface border border-bg-border rounded-lg p-8 flex flex-col justify-center space-y-4">
           <div className="flex items-center justify-between">
              <span className="text-[0.7rem] font-bold uppercase tracking-widest text-text-dim">Protocol Status</span>
              <Badge variant={transaction.type === 'income' ? 'teal' : 'red'}>
                {transaction.type === 'income' ? 'CREDIT_INITIALIZED' : 'DEBIT_VERIFIED'}
              </Badge>
           </div>
           <div className="pt-4 border-t border-bg-border flex items-center justify-between">
              <span className="text-[0.7rem] font-bold uppercase tracking-widest text-text-dim">Taxonomy</span>
              <span className="text-lg font-bold text-text-primary uppercase tracking-tight">{transaction.category}</span>
           </div>
        </div>
      </div>

      {/* Audit Detailed Logs */}
      <div className="bg-bg-surface border border-bg-border rounded-lg shadow-card overflow-hidden">
        <div className="p-6 border-b border-bg-border bg-bg-base/30 flex items-center gap-3">
           <Terminal size={18} className="text-accent-teal" />
           <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">Ledger Intelligence Data</h3>
        </div>
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-10">
              <div className="flex items-start gap-4">
                 <div className="p-3 rounded-btn bg-bg-base border border-bg-border text-text-dim"><Calendar size={22} /></div>
                 <div className="space-y-1">
                    <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest">Entry Timestamp</p>
                    <p className="text-xl font-bold text-text-primary tracking-tight font-mono">{formatDate(transaction.date)}</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="p-3 rounded-btn bg-bg-base border border-bg-border text-text-dim"><Fingerprint size={22} /></div>
                 <div className="space-y-1">
                    <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest">Authorized Identity</p>
                    <p className="text-xl font-bold text-accent-teal tracking-tight">USER_{transaction.user_id.toString().padStart(4, '0')}</p>
                 </div>
              </div>
           </div>
           <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <FileText size={16} className="text-accent-blue" />
                 <span className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest">System Intelligence Overlay</span>
              </div>
              <div className="p-6 rounded-lg bg-bg-base border border-bg-border min-h-[160px] relative overflow-hidden">
                 <p className="text-sm text-text-primary font-medium leading-relaxed italic relative z-10">
                    "{transaction.notes || 'No supplemental metadata provided for this specific ledger cycle.'}"
                 </p>
                 <div className="absolute bottom-[-20%] right-[-10%] opacity-5 rotate-12">
                    <Activity size={120} />
                 </div>
              </div>
           </div>
        </div>
        <div className="px-10 py-6 border-t border-bg-border bg-bg-base/30 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase text-text-dim tracking-[0.2em] block">Sovereign Node ID</span>
              <span className="text-xs font-mono font-bold text-text-primary">SHA256_{transaction.id.toString(16).toUpperCase()}..v4</span>
           </div>
           <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase text-text-dim tracking-[0.2em] block">Validation Engine</span>
              <span className="text-xs font-mono font-bold text-text-primary">GALILEO-CORE-V2</span>
           </div>
           <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase text-text-dim tracking-[0.2em] block">Lifecycle Status</span>
              <span className="text-xs font-bold text-accent-teal flex items-center gap-2">
                <Shield size={12} /> COMMITTED_BY_CONSENSUS
              </span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
