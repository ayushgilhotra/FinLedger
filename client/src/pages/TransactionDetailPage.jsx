import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { transactionsApi } from '../api/transactions.api';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { formatDate, formatCurrency } from '../utils/formatters';
import { ChevronLeft, Edit, Trash, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
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
    if (window.confirm('Delete this transaction permanently?')) {
      try {
        await transactionsApi.deleteTransaction(id);
        toast.success('Transaction deleted');
        navigate('/transactions');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const canModify = transaction && (
    user.role === 'admin' || (user.role === 'analyst' && transaction.user_id === user.id)
  );

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" label="Retrieving ledger data..." /></div>;

  if (!transaction) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">Transaction not found</h2>
      <Link to="/transactions"><Button>Back to Journal</Button></Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/transactions" className="inline-flex items-center text-accent hover:underline mb-2">
        <ChevronLeft size={16} className="mr-1" /> Back to Journal
      </Link>

      <Card 
        title={`Transaction Reference #${transaction.id.toString().padStart(6, '0')}`}
        action={
          <div className="flex gap-2">
            {canModify && (
              <>
                <Button variant="secondary" size="sm" onClick={() => toast.success('Use the edit button on the main transactions page')}>
                  <Edit size={16} className="mr-2" /> Modify
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  <Trash size={16} className="mr-2" /> Purge
                </Button>
              </>
            )}
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-bg-elevated text-text-secondary"><CreditCard size={20} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Amount</p>
                <p className={`text-2xl font-mono font-bold mt-1 ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-bg-elevated text-text-secondary"><Tag size={20} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Classification</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-text-primary">{transaction.category}</span>
                  <Badge variant={transaction.type}>{transaction.type}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-bg-elevated text-text-secondary"><Calendar size={20} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Transaction Date</p>
                <p className="text-lg font-bold text-text-primary mt-1 font-mono">{formatDate(transaction.date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-bg-elevated text-text-secondary"><FileText size={20} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Notes & Audit Info</p>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                  {transaction.notes || 'No extended notes provided for this ledger entry.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-bg-border flex flex-wrap gap-x-8 gap-y-4">
          <div>
            <span className="text-[10px] font-black uppercase text-text-muted block">System ID</span>
            <span className="text-xs font-mono font-bold">{transaction.id}</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-text-muted block">Creator ID</span>
            <span className="text-xs font-mono font-bold">USER-{transaction.user_id}</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-text-muted block">Audit Timestamp</span>
            <span className="text-xs font-mono font-bold text-text-muted">{transaction.created_at}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TransactionDetailPage;
