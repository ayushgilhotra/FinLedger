import React, { useState, useEffect, useCallback } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../hooks/useAuth';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import GlassInput from '../components/ui/GlassInput';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import Pagination from '../components/ui/Pagination';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Plus, Search, Edit2, Trash2, XCircle, ChevronRight, Download, Shield, LayoutGrid, Wallet } from 'lucide-react';
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

  const [filters, setFilters] = useState({ page: 1, limit: 12 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    setFilters({ page: 1, limit: 12 });
  };

  const openAddDrawer = () => {
    setEditingTx(null);
    reset({
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (tx) => {
    setEditingTx(tx);
    setValue('amount', tx.amount);
    setValue('type', tx.type);
    setValue('category', tx.category);
    setValue('date', tx.date);
    setValue('notes', tx.notes || '');
    setIsDrawerOpen(true);
  };

  const onSubmit = async (data) => {
    const success = editingTx 
      ? await updateTransaction(editingTx.id, data)
      : await createTransaction(data);
    
    if (success) {
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirm revocation of this ledger entry?')) {
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
      render: (row) => <span className="font-mono text-[11px] font-bold tracking-wider text-text-secondary uppercase">{formatDate(row.date)}</span>
    },
    { 
      header: 'Entity / Taxonomy', 
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
          {row.type === 'income' ? 'CREDIT_INITIALIZED' : 'DEBIT_VERIFIED'}
        </Badge>
      )
    },
    { 
      header: 'Volume', 
      accessor: 'amount', 
      className: 'text-right',
      render: (row) => (
        <span className={`font-bold tabular-nums tracking-tight ${row.type === 'income' ? 'text-accent-teal' : 'text-accent-red'}`}>
          {row.type === 'income' ? '+' : '-'}{formatCurrency(row.amount)}
        </span>
      )
    },
    { 
      accessor: 'notes', 
      render: (row) => <span className="text-text-secondary text-[11px] font-medium truncate max-w-[200px] inline-block italic">"{row.notes || 'No log entry'}"</span> 
    },
    { 
      header: 'Governance', 
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          {canModify(row) ? (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); openEditDrawer(row); }}
                className="p-1.5 rounded-btn text-text-primary/70 hover:text-accent-teal hover:bg-accent-teal/5 transition-all border border-transparent hover:border-accent-teal/20"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                className="p-1.5 rounded-btn text-text-primary/70 hover:text-accent-red hover:bg-accent-red/5 transition-all border border-transparent hover:border-accent-red/20"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <Badge variant="blue" outline className="opacity-50 grayscale">IMMUTABLE</Badge>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-20 animate-in">
      {/* Search & Actions Terminal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-bg-surface p-6 rounded-lg border border-bg-border shadow-card relative overflow-hidden">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group">
            <label className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-text-dim ml-1 mb-1 block">Traffic Class</label>
            <select 
              name="type" 
              value={filters.type || ''} 
              onChange={handleFilterChange}
              className="w-full h-10 bg-bg-base border border-bg-border text-text-primary text-[0.75rem] font-bold uppercase tracking-widest px-4 rounded-btn transition-all outline-none appearance-none cursor-pointer focus:border-accent-teal/40 bg-no-repeat bg-[right_1rem_center] custom-select-arrow"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%233D6080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
            >
              <option value="">ALL_FLOWS</option>
              <option value="income">INFLOW_ONLY</option>
              <option value="expense">OUTFLOW_ONLY</option>
            </select>
          </div>
          <GlassInput 
            label="Filter Intelligence" 
            name="category" 
            placeholder="Search category..." 
            icon={Search}
            value={filters.category || ''}
            onChange={handleFilterChange}
            className="h-10"
          />
          <GlassInput 
            label="Delta Start" 
            type="date" 
            name="startDate" 
            value={filters.startDate || ''}
            onChange={handleFilterChange}
          />
          <GlassInput 
            label="Delta End" 
            type="date" 
            name="endDate"
            value={filters.endDate || ''}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex gap-3 pt-5 lg:pt-0">
          <Button variant="secondary" size="md" onClick={handleResetFilters} className="h-10 px-4 border-bg-border">
            <XCircle size={14} className="mr-2" /> Reset
          </Button>
          <Button size="md" onClick={openAddDrawer} className="h-10 px-6 shadow-teal-glow">
            <Plus size={16} className="mr-2" /> Deploy Ingress
          </Button>
        </div>
      </div>

      {/* Primary Ledger Terminal */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-accent-teal" />
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-text-primary">Secured Ledger Stream</span>
          </div>
          <div className="flex items-center gap-4">
             <button className="p-1.5 rounded-btn text-text-primary/70 hover:text-text-primary transition-all">
               <Download size={16} />
             </button>
             <button className="p-1.5 rounded-btn text-text-primary/70 hover:text-text-primary transition-all">
               <LayoutGrid size={16} />
             </button>
          </div>
        </div>
        
        <div className="rounded-lg border border-bg-border bg-bg-surface overflow-hidden shadow-card">
          <DataTable 
            columns={columns} 
            data={transactions} 
            loading={loading} 
          />
          <div className="px-8 py-4 border-t border-bg-border bg-bg-base/30 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary opacity-70">
              Encryption Node: GALILEO-S-01
            </span>
            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.totalPages} 
              onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
            />
          </div>
        </div>
      </div>

      {/* Deployment Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingTx ? 'Node Reconfiguration' : 'Deploy Central Ledger Entry'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-6">
            <GlassInput 
              label="Transaction Volume (USD)" 
              type="number" 
              step="0.01"
              placeholder="0.00"
              icon={Wallet}
              {...register('amount', { required: 'Operational volume required', min: { value: 0.01, message: 'Minimum threshold: $0.01' } })}
              error={errors.amount?.message}
            />

            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold uppercase tracking-[0.08em] ml-1 text-text-secondary">
                Protocol Class
              </label>
              <div className="relative group">
                <select 
                  className="w-full h-11 bg-bg-base border border-bg-border text-text-primary text-sm px-4 rounded-btn transition-all duration-200 outline-none uppercase tracking-widest appearance-none cursor-pointer focus:border-accent-teal/60 ring-accent-teal/10 focus:ring-2 bg-no-repeat bg-[right_1rem_center] custom-select-arrow"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233D6080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                  {...register('type', { required: 'Protocol classification required' })}
                >
                  <option value="expense" className="bg-bg-surface text-accent-red font-bold">DEBIT_PROTOCOL</option>
                  <option value="income" className="bg-bg-surface text-accent-teal font-bold">CREDIT_PROTOCOL</option>
                </select>
              </div>
            </div>

            <GlassInput 
              label="Taxonomy Classification" 
              placeholder="e.g. INFRASTRUCTURE_COST"
              {...register('category', { required: 'Taxonomy classification required' })}
              error={errors.category?.message}
            />

            <GlassInput 
              label="Interval Timestamp" 
              type="date"
              {...register('date', { required: 'Timestamp required' })}
              error={errors.date?.message}
            />

            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold uppercase tracking-[0.08em] ml-1 text-text-secondary">
                Intelligence Overlays / Notes
              </label>
              <textarea 
                className="w-full rounded-btn border border-bg-border bg-bg-base px-5 py-4 text-sm font-medium text-text-primary placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-accent-teal/10 focus:border-accent-teal/40 transition-all min-h-[140px] modern-scrollbar"
                placeholder="Initialize deployment metadata..."
                {...register('notes')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <Button type="submit" loading={loading} className="w-full h-12 shadow-teal-glow">
              {editingTx ? 'Confirm Reconfiguration' : 'Deploy to Mainnet Node'}
            </Button>
            <Button variant="ghost" type="button" onClick={() => setIsDrawerOpen(false)} className="w-full h-12 text-text-dim hover:text-text-primary">
              Abort Deployment
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default TransactionsPage;
