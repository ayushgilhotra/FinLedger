import React, { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../api/users.api';
import Table from '../components/ui/Table';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import { formatDate } from '../utils/formatters';
import { UserCog, Shield, Activity, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getUsers(filters);
      setUsers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (id, role) => {
    try {
      await usersApi.updateUserRole(id, role);
      toast.success('User role updated');
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await usersApi.updateUserStatus(id, newStatus);
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { 
      header: 'Identity', 
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold">{row.name}</span>
          <span className="text-xs text-text-muted font-mono">{row.email}</span>
        </div>
      )
    },
    { 
      header: 'Access Level', 
      render: (row) => (
        <select 
          value={row.role}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="bg-bg-surface border border-bg-border text-xs font-bold rounded-lg px-2 py-1 focus:ring-1 focus:ring-accent outline-none"
        >
          <option value="admin">Admin</option>
          <option value="analyst">Analyst</option>
          <option value="user">User</option>
        </select>
      )
    },
    { 
      header: 'System Status', 
      render: (row) => (
        <div className="flex items-center gap-4">
          <Badge variant={row.status} dot>{row.status}</Badge>
          <button 
            onClick={() => handleStatusToggle(row.id, row.status)}
            className={`text-[10px] font-bold uppercase tracking-widest hover:underline ${row.status === 'active' ? 'text-expense' : 'text-income'}`}
          >
            {row.status === 'active' ? 'Disable' : 'Enable'}
          </button>
        </div>
      )
    },
    { 
      header: 'Member Since', 
      render: (row) => <span className="text-xs font-mono text-text-muted">{formatDate(row.created_at)}</span>
    },
    {
      header: 'Audit',
      render: (row) => (
        <Link to={`/profile/${row.id}`}>
          <button className="p-2 hover:bg-accent/10 rounded-lg text-accent transition-colors" title="View Portfolio">
            <Eye size={16} />
          </button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center text-center py-8 border-accent shadow-glow">
          <Shield className="text-accent mb-2" size={32} />
          <h4 className="text-2xl font-display font-bold">RBAC</h4>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Role Management</p>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center py-8">
          <Activity className="text-info mb-2" size={32} />
          <h4 className="text-2xl font-display font-bold">{pagination.total || 0}</h4>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Total Users</p>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center py-8">
          <UserCog className="text-warning mb-2" size={32} />
          <h4 className="text-2xl font-display font-bold">Admin</h4>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">System Console</p>
        </Card>
      </div>

      <Card noPadding>
        <Table columns={columns} data={users} loading={loading} />
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

export default UsersPage;
