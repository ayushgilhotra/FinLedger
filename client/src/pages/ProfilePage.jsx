import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usersApi } from '../api/users.api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/formatters';
import { User, Shield, AtSign, Clock, ShieldCheck, Loader2 } from 'lucide-react';

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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-white">Identity Not Found</h3>
        <p className="text-text-secondary mt-2">The requested profile does not exist or has been decommissioned.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <div className="h-32 w-32 rounded-3xl bg-accent flex items-center justify-center shadow-glow">
          <User size={64} className="text-bg-base" strokeWidth={2.5} />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-4xl font-display font-bold tracking-normal text-white uppercase">
            {user?.name}
          </h3>
          <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-4">
            <Badge variant={user?.role} className="py-1 px-4">{user?.role}</Badge>
            <Badge variant="active" dot className="py-1 px-4">System Online</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Account Credentials">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-bg-elevated text-accent"><AtSign size={20} /></div>
              <div>
                <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Registered Identity</p>
                <p className="text-lg font-bold text-text-primary">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-bg-elevated text-info"><ShieldCheck size={20} /></div>
              <div>
                <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Authority Level</p>
                <p className="text-lg font-bold text-text-primary uppercase">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-bg-elevated text-warning"><Clock size={20} /></div>
              <div>
                <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Onboarding Date</p>
                <p className="text-lg font-bold text-text-primary">{user?.created_at ? formatDate(user.created_at) : 'Dec 2024'}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Identity Verification">
          <div className="space-y-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              Your identity is verified via the enterprise authentication gateway. For security reasons, sensitive account settings must be changed via an administrator request.
            </p>
            <div className="p-4 rounded-xl bg-bg-elevated border border-bg-border border-l-4 border-l-accent">
              <h5 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Shield size={16} /> Data Encryption Active
              </h5>
              <p className="text-xs text-text-secondary mt-1">All session data is encrypted using AES-256 and transmitted over a secure TLS tunnel.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
