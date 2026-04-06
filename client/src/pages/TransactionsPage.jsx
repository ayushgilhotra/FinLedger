import React, { useState, useEffect, useCallback } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../hooks/useAuth';
import Table from '../components/ui/Table';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Plus, Search, Filter, Edit2, Trash2, XCircle, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

const TransactionsPage = () => {
  const { user } = useAuth();
  const { 
    transactions, 
    pagination, 
    loading, 
    fetchTransactions, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();

  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const loadData = useCallback(() => {
    fetchTransactions(filters);
  }, [fetchTransactions, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const openAddModal = () => {
    setEditingTx(null);
    reset({
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingTx(tx);
    setValue('amount', tx.amount);
    setValue('type', tx.type);
    setValue('category', tx.category);
    setValue('date', tx.date);
    setValue('notes', tx.notes || '');
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const success = editingTx 
      ? await updateTransaction(editingTx.id, data)
      : await createTransaction(data);
    
    if (success) {
      setIsModalOpen(false);
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const success = await deleteTransaction(id);
      if (success) loadData();
    }
  };

  const canModify = (tx) => {
    if (user.role === 'admin') return true;
    return tx.user_id === user.id;
  };

  const columns = [
    { 
      header: 'Settlement Date', 
      accessor: 'date',
      render: (row) => <span className="font-mono text-[10px] font-black tracking-widest text-text-secondary uppercase">{formatDate(row.date)}</span>
    },
    { 
      header: 'Category Taxonomy', 
      accessor: 'category', 
      render: (row) => <span className="font-black text-xs uppercase tracking-widest text-white">{row.category}</span> 
    },
    { 
      header: 'Network Status', 
      accessor: 'type', 
      render: (row) => <Badge variant={row.type}>{row.type}</Badge>
    },
    { 
      header: 'Transaction Volume', 
      accessor: 'amount', 
      render: (row) => (
        <span className={cn(
          "font-mono text-sm font-black tabular-nums tracking-tighter",
          row.type === 'income' ? 'text-income' : 'text-expense'
        )}>
          {row.type === 'income' ? '+' : '-'}{formatCurrency(row.amount)}
        </span>
      )
    },
    { 
      header: 'Audit Notes', 
      accessor: 'notes', 
      render: (row) => <span className="text-text-secondary text-[10px] font-bold uppercase tracking-tight truncate max-w-[150px] inline-block">{row.notes || '-'}</span> 
    },
    { 
      header: 'Governance', 
      render: (row) => (
        <div className="flex gap-3">
          {canModify(row) ? (
            <>
              <button 
                onClick={() => openEditModal(row)}
                className="p-2 rounded-2xl bg-white/5 text-text-secondary hover:text-accent hover:bg-accent/10 transition-all border border-white/5"
                title="Modify"
              >
                <Edit2 size={14} strokeWidth={3} />
              </button>
              <button 
                onClick={() => handleDelete(row.id)}
                className="p-2 rounded-2xl bg-white/5 text-text-secondary hover:text-expense hover:bg-expense/10 transition-all border border-white/5"
                title="Revoke"
              >
                <Trash2 size={14} strokeWidth={3} />
              </button>
            </>
          ) : (
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted px-3 py-1 rounded-full bg-white/5 border border-white/5">Immutable</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Filters & Actions */}
      <Card variant="glass" className="p-2 border-white/10 rounded-[3rem]">
        <div className="flex flex-col lg:flex-row lg:items-end gap-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Network Type</label>
              <div className="relative group">
                <select 
                  name="type" 
                  value={filters.type || ''} 
                  onChange={handleFilterChange}
                  className="w-full h-12 px-5 rounded-2xl border border-white/5 bg-bg-base/40 text-[11px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer hover:bg-bg-elevated/30"
                >
                  <option value="">Consolidated View</option>
                  <option value="income">Inflow Only</option>
                  <option value="expense">Outflow Only</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent transition-colors">
                  <ChevronRight size={14} strokeWidth={3} className="rotate-90" />
                </div>
              </div>
            </div>
            <Input 
              label="Intelligence Search" 
              name="category" 
              placeholder="e.g. INFRASTRUCTURE" 
              value={filters.category || ''}
              onChange={handleFilterChange}
            />
            <Input 
              label="Start Interval" 
              type="date" 
              name="startDate" 
              value={filters.startDate || ''}
              onChange={handleFilterChange}
            />
            <Input 
              label="End Interval" 
              type="date" 
              name="endDate"
              value={filters.endDate || ''}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" size="md" onClick={handleResetFilters} className="border-white/10">
              <XCircle size={16} className="mr-2" strokeWidth={3} /> Clear Node
            </Button>
            <Button size="md" onClick={openAddModal} className="shadow-neon">
              <Plus size={16} className="mr-2" strokeWidth={3} /> Deploy Entry
            </Button>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card variant="glass" noPadding className="border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
        <Table 
          columns={columns} 
          data={transactions} 
          loading={loading} 
        />
        <div className="px-10 py-6 border-t border-white/5 bg-white/[0.02]">
          <Pagination 
            currentPage={pagination.page} 
            totalPages={pagination.totalPages} 
            onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
          />
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTx ? 'Node Reconfiguration' : 'Deploy Ledger Entry'}
        footer={
          <div className="flex gap-4 w-full justify-end px-6 pb-6">
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)} className="font-black uppercase tracking-widest text-[11px]">Abort</Button>
            <Button size="md" onClick={handleSubmit(onSubmit)} loading={loading} className="shadow-neon">
              {editingTx ? 'Update Deployment' : 'Post to Blockchain'}
            </Button>
          </div>
        }
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="space-y-8">
            <Input 
              label="Deployment Volume (INR)" 
              type="number" 
              step="0.01"
              placeholder="0.00"
              {...register('amount', { required: 'Volume is required', min: { value: 0.01, message: 'Must be > 0' } })}
              error={errors.amount?.message}
            />
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Transfer Protocol</label>
              <div className="relative group">
                <select 
                  className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-bg-base/40 text-[11px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer hover:bg-bg-elevated/30"
                  {...register('type', { required: 'Protocol is required' })}
                >
                  <option value="expense">Outflow Protocol</option>
                  <option value="income">Inflow Protocol</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent transition-colors">
                  <ChevronRight size={14} strokeWidth={3} className="rotate-90" />
                </div>
              </div>
            </div>
            <Input 
              label="Category Classification" 
              placeholder="e.g. CAPITAL_EXPENSE"
              {...register('category', { required: 'Classification is required' })}
              error={errors.category?.message}
            />
          </div>
          <div className="space-y-8">
            <Input 
              label="Interval Timestamp" 
              type="date"
              {...register('date', { required: 'Timestamp is required' })}
              error={errors.date?.message}
            />
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Intelligence Logs</label>
              <textarea 
                className="w-full rounded-2xl border border-white/10 bg-bg-base/40 px-5 py-4 text-xs font-bold text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all min-h-[140px] hover:bg-bg-elevated/20 focus:bg-bg-elevated/40"
                placeholder="Log additional deployment metadata..."
                {...register('notes')}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const cn = (...inputs) => inputs.filter(Boolean).join(' ');

export default TransactionsPage;
