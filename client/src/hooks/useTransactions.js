import { useState, useCallback } from 'react';
import { transactionsApi } from '../api/transactions.api';
import toast from 'react-hot-toast';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async (filters) => {
    setLoading(true);
    try {
      const response = await transactionsApi.getTransactions(filters);
      setTransactions(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.error || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = async (data) => {
    try {
      await transactionsApi.createTransaction(data);
      toast.success('Transaction created successfully');
      return true;
    } catch (err) {
      return false;
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      await transactionsApi.updateTransaction(id, data);
      toast.success('Transaction updated successfully');
      return true;
    } catch (err) {
      return false;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionsApi.deleteTransaction(id);
      toast.success('Transaction deleted successfully');
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    transactions,
    pagination,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
