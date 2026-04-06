import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usersApi } from '../api/users.api';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
import { formatDate } from '../utils/formatters';
import { User, Shield, AtSign, Clock, ShieldCheck, Loader2, Fingerprint, Key, Globe, Activity } from 'lucide-react';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setUser(authUser);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await usersApi.getUserById(id);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, authUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <Loader2 className="animate-spin text-accent-teal" size={48} />
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-text-dim">Synchronizing Identity Vault...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-40 space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-btn bg-accent-red/10 text-accent-red border border-accent-red/20 mb-4">
          <Shield size={32} />
        </div>
        <h3 className="text-2xl font-bold text-text-primary tracking-tight">Identity Terminated</h3>
        <p className="text-text-dim font-medium max-w-sm mx-auto">The requested protocol identifier does not exist or has been purged from the central node.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in">
      {/* Identity Header */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div className="h-40 w-40 rounded-btn bg-bg-surface border-2 border-bg-border flex items-center justify-center text-text-primary shadow-card relative z-10 transition-all group-hover:border-accent-teal/40">
            <User size={80} strokeWidth={1.5} />
            <div className="absolute inset-0 bg-accent-teal/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-btn" />
          </div>
          <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-btn bg-accent-teal text-bg-base flex items-center justify-center shadow-teal-glow z-20">
            <Fingerprint size={20} />
          </div>
        </div>
        
        <div className="text-center md:text-left space-y-4">
          <div>
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-teal mb-1 block">Account Principal</span>
            <h1 className="text-5xl font-extrabold text-text-primary tracking-tight">{user?.name}</h1>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <Badge variant={user?.role === 'admin' ? 'blue' : 'teal'}>
               {user?.role === 'admin' ? 'ROOT_GOVERNANCE' : 'NODE_ACCESS_LEVEL'}
             </Badge>
             <Badge variant="teal" outline>STATUS_NOMINAL</Badge>
          </div>
        </div>
      </div>

      {/* Identity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-bg-surface border border-bg-border rounded-lg shadow-card overflow-hidden">
          <div className="p-6 border-b border-bg-border bg-bg-base/30">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary flex items-center gap-2">
              <Key size={16} className="text-accent-teal" />
              Identity Credentials
            </h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="p-3 rounded-btn bg-bg-base border border-bg-border text-accent-blue group-hover:border-accent-blue/40 transition-all"><AtSign size={22} /></div>
              <div className="space-y-1">
                <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest">Master Protocol Addr</p>
                <p className="text-lg font-bold text-text-primary tracking-tight">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="p-3 rounded-btn bg-bg-base border border-bg-border text-accent-teal group-hover:border-accent-teal/40 transition-all"><ShieldCheck size={22} /></div>
              <div className="space-y-1">
                <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest">Authority Tier</p>
                <p className="text-lg font-bold text-text-primary uppercase tracking-tight">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="p-3 rounded-btn bg-bg-base border border-bg-border text-accent-amber group-hover:border-accent-amber/40 transition-all"><Clock size={22} /></div>
              <div className="space-y-1">
                <p className="text-[0.65rem] font-bold uppercase text-text-dim tracking-widest">Provisioned Timestamp</p>
                <p className="text-lg font-bold text-text-primary tracking-tight">
                  {user?.created_at ? formatDate(user.created_at) : 'NODE_EXP_PRE'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-bg-surface border border-bg-border rounded-lg shadow-card p-8 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield size={120} strokeWidth={1} />
             </div>
             <div className="relative z-10 space-y-4">
                <Badge variant="blue" className="bg-accent-blue/10 border-accent-blue/20">SECURITY_POLICY_ACTIVE</Badge>
                <h3 className="text-xl font-bold text-text-primary tracking-tight">Identity Vault Integrity</h3>
                <p className="text-sm text-text-dim font-medium leading-relaxed">
                  Your sovereign identity is verified via the GALILEO institutional authentication gateway. 
                  All profile metadata is shard-encrypted and stored across decentralized nodes.
                </p>
             </div>
             <div className="pt-6 grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-lg bg-bg-base border border-bg-border space-y-1">
                  <Globe size={14} className="text-accent-teal mb-2" />
                  <p className="text-[10px] font-bold uppercase text-text-dim">Region</p>
                  <p className="text-xs font-bold text-text-primary">GLOBAL_NODE_01</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-base border border-bg-border space-y-1">
                  <Activity size={14} className="text-accent-blue mb-2" />
                  <p className="text-[10px] font-bold uppercase text-text-dim">MFA</p>
                  <p className="text-xs font-bold text-accent-teal">VERIFIED</p>
                </div>
             </div>
          </div>
          
          <div className="p-6 rounded-lg bg-accent-teal/5 border border-dashed border-accent-teal/20 flex items-center justify-between group cursor-pointer hover:bg-accent-teal/10 transition-all">
             <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent-teal/20 flex items-center justify-center text-accent-teal">
                  <Shield size={20} />
                </div>
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-text-primary">Download Security Audit</span>
             </div>
             <ChevronRight size={18} className="text-text-dim group-hover:text-accent-teal transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
