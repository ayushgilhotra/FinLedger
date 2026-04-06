import React, { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../api/users.api';
import DataTable from '../components/ui/DataTable';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import { formatDate } from '../utils/formatters';
import { UserCog, Shield, Activity, Calendar, Eye, UserCheck, Users, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 12 });

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
      toast.success('Security tier updated');
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Privilege escalation failed');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await usersApi.updateUserStatus(id, newStatus);
      toast.success(`Node ${newStatus === 'active' ? 'activated' : 'quarantined'}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Status transition failed');
    }
  };

  const columns = [
    { 
      header: 'Identity / Fingerprint', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-btn bg-accent-blue/10 flex items-center justify-center text-accent-blue border border-accent-blue/20">
            <Fingerprint size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[0.875rem] font-bold text-text-primary">{row.name}</span>
            <span className="text-[0.7rem] text-text-dim font-mono uppercase tracking-tight">{row.email}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Security Tier', 
      render: (row) => (
        <div className="relative group min-w-[140px]">
          <select 
            value={row.role}
            onChange={(e) => handleRoleChange(row.id, e.target.value)}
            className="w-full bg-bg-base border border-bg-border text-[0.7rem] font-bold uppercase tracking-widest rounded-btn px-3 py-1.5 focus:border-accent-teal/40 outline-none appearance-none cursor-pointer hover:bg-bg-elevated/30"
          >
            <option value="admin">ROOT_ADMIN</option>
            <option value="analyst">INTEL_ANALYST</option>
            <option value="user">NODE_ACCESS</option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-dim group-hover:text-accent-teal transition-colors">
            <ChevronRight size={12} className="rotate-90" />
          </div>
        </div>
      )
    },
    { 
      header: 'Node Status', 
      render: (row) => (
        <div className="flex items-center gap-4">
          <Badge variant={row.status === 'active' ? 'teal' : 'red'}>
            {row.status === 'active' ? 'NOMINAL' : 'QUARANTINED'}
          </Badge>
          <button 
            onClick={() => handleStatusToggle(row.id, row.status)}
            className={`text-[0.65rem] font-bold uppercase tracking-[0.15em] border-b border-transparent transition-all hover:border-current ${row.status === 'active' ? 'text-accent-red hover:text-accent-red' : 'text-accent-teal hover:text-accent-teal'}`}
          >
            {row.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    },
    { 
      header: 'Registration Timestamp', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-text-dim" />
          <span className="text-[11px] font-bold text-text-dim uppercase tracking-wider">{formatDate(row.created_at)}</span>
        </div>
      )
    },
    {
      header: 'Audit Portfolio',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end">
          <Link to={`/profile/${row.id}`} className="p-2 rounded-btn bg-bg-base border border-bg-border text-text-dim hover:text-accent-teal hover:border-accent-teal/40 transition-all shadow-sm">
            <Eye size={16} />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 pb-20 animate-in">
      {/* Telemetry Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-teal mb-1 block">Network Governance</span>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Active Node Directory</h1>
        </div>
      </div>

      {/* Governance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Network Identities" 
          value={pagination.total || 0} 
          icon={Users} 
          variant="blue" 
          isHero 
          isCurrency={false}
        />
        <StatCard 
          label="Sovereign Access Level" 
          value={842} 
          delta="Stable topology" 
          icon={Shield} 
          variant="teal" 
          isCurrency={false}
        />
        <StatCard 
          label="Audit Requests" 
          value={12} 
          delta="Requires review" 
          isNegative 
          icon={Activity} 
          variant="amber" 
          isCurrency={false}
        />
      </div>

      {/* Primary Registry Terminal */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <UserCheck size={18} className="text-accent-teal" />
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-text-primary">Verified Network Entities</span>
        </div>
        
        <div className="rounded-lg border border-bg-border bg-bg-surface overflow-hidden shadow-card">
          <DataTable 
            columns={columns} 
            data={users} 
            loading={loading} 
          />
          <div className="px-8 py-4 border-t border-bg-border bg-bg-base/30 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim opacity-70">
              Authority Node: GALILEO-AUTH-X
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

const ChevronRight = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default UsersPage;
