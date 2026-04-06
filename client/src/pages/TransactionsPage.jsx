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
import { Plus, Search, Filter, Edit2, Trash2, XCircle } from 'lucide-react';
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
      header: 'Date', 
      accessor: 'date',
      render: (row) => <span className="font-mono text-xs text-text-secondary">{formatDate(row.date)}</span>
    },
    { header: 'Category', accessor: 'category', render: (row) => <span className="font-bold">{row.category}</span> },
    { 
      header: 'Type', 
      accessor: 'type', 
      render: (row) => <Badge variant={row.type}>{row.type}</Badge>
    },
    { 
      header: 'Amount', 
      accessor: 'amount', 
      render: (row) => (
        <span className={row.type === 'income' ? 'text-income font-semibold tabular-nums tracking-normal' : 'text-expense font-semibold tabular-nums tracking-normal'}>
          {row.type === 'income' ? '+' : '-'}{formatCurrency(row.amount)}
        </span>
      )
    },
    { 
      header: 'Notes', 
      accessor: 'notes', 
      render: (row) => <span className="text-text-secondary text-xs truncate max-w-[150px] inline-block">{row.notes || '-'}</span> 
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex gap-2">
          {canModify(row) ? (
            <>
              <button 
                onClick={() => openEditModal(row)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(row.id)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-expense hover:bg-expense/10 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <span className="text-text-muted italic text-[10px] uppercase font-bold tracking-widest">Locked</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <Card className="glass">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Type</label>
              <select 
                name="type" 
                value={filters.type || ''} 
                onChange={handleFilterChange}
                className="h-10 w-full rounded-lg border border-bg-border bg-bg-surface px-3 text-sm focus:outline-none focus:border-accent"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <Input 
              label="Category" 
              name="category" 
              placeholder="Search category..." 
              value={filters.category || ''}
              onChange={handleFilterChange}
            />
            <Input 
              label="Start Date" 
              type="date" 
              name="startDate" 
              value={filters.startDate || ''}
              onChange={handleFilterChange}
            />
            <Input 
              label="End Date" 
              type="date" 
              name="endDate"
              value={filters.endDate || ''}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleResetFilters}>
              <XCircle size={18} className="mr-2" /> Reset
            </Button>
            <Button onClick={openAddModal}>
              <Plus size={18} className="mr-2" /> New Entry
            </Button>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card noPadding>
        <Table 
          columns={columns} 
          data={transactions} 
          loading={loading} 
        />
        <div className="px-6 border-t border-bg-border">
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
        title={editingTx ? 'Edit Transaction' : 'Record Transaction'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} loading={loading}>
              {editingTx ? 'Apply Changes' : 'Post to Ledger'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input 
            label="Amount (INR)" 
            type="number" 
            step="0.01"
            placeholder="0.00"
            {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Amount must be > 0' } })}
            error={errors.amount?.message}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary uppercase">Type</label>
            <select 
              className="h-11 w-full rounded-lg border border-bg-border bg-bg-surface px-4 text-sm focus:ring-2 focus:ring-accent/40"
              {...register('type', { required: 'Type is required' })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <Input 
            label="Category" 
            placeholder="e.g. Salary, Utilities, Food"
            {...register('category', { required: 'Category is required' })}
            error={errors.category?.message}
          />
          <Input 
            label="Date" 
            type="date"
            {...register('date', { required: 'Date is required' })}
            error={errors.date?.message}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary uppercase">Notes (Optional)</label>
            <textarea 
              className="w-full rounded-lg border border-bg-border bg-bg-surface px-4 py-2 text-sm min-h-[100px] focus:ring-2 focus:ring-accent/40"
              placeholder="Add details about this transaction..."
              {...register('notes')}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TransactionsPage;
