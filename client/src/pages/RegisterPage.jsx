import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TrendingUp, User, Mail, Lock, UserPlus, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg-base p-6 relative overflow-hidden py-20">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] h-[70%] w-[70%] rounded-full bg-accent/5 blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[70%] w-[70%] rounded-full bg-indigo-500/5 blur-[150px]" />

      <div className="w-full max-w-2xl z-10 space-y-12 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-accent text-bg-base shadow-neon mb-2">
            <TrendingUp size={40} strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-display font-black tracking-tight text-white uppercase italic text-center">
              Fin<span className="text-accent">Ledger</span>
            </h1>
            <p className="text-text-secondary text-lg font-black tracking-[0.2em] uppercase text-center">Cloud Ledger Architecture</p>
          </div>
        </div>

        <Card variant="glass" className="p-2 border-white/10 shadow-2xl backdrop-blur-3xl rounded-[3rem]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Input
                  label="Network Identity"
                  placeholder="abc"
                  {...register('name', { required: 'Identity is required' })}
                  error={errors.name?.message}
                />

                <Input
                  label="Contact Protocol"
                  type="email"
                  placeholder="nexus@galileo.io"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid format' }
                  })}
                  error={errors.email?.message}
                />

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Access Tier</label>
                  <div className="relative group">
                    <select 
                      className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-bg-base/40 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer hover:bg-bg-elevated/30 uppercase tracking-widest"
                      {...register('role', { required: 'Tier is required' })}
                    >
                      <option value="user" className="bg-[#000511] text-white">Baseline Access</option>
                      <option value="analyst" className="bg-[#000511] text-white">Expert Analytics</option>
                      <option value="admin" className="bg-[#000511] text-white">Full Governance</option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent transition-colors">
                      <ChevronRight size={18} strokeWidth={3} className="rotate-90" />
                    </div>
                  </div>
                  {errors.role && <p className="mt-1 text-[10px] font-black uppercase text-expense ml-1">{errors.role.message}</p>}
                </div>
              </div>

              <div className="space-y-8">
                <Input
                  label="Security Token"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Required',
                    minLength: { value: 6, message: 'Min 6 chars' }
                  })}
                  error={errors.password?.message}
                />

                <Input
                  label="Token Verification"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword', { 
                    required: 'Required',
                    validate: (val) => val === password || 'Mismatch'
                  })}
                  error={errors.confirmPassword?.message}
                />
                
                <div className="pt-2">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-accent">Security Policy</h4>
                    <p className="text-[11px] text-text-secondary leading-relaxed font-bold uppercase tracking-tight">
                      By initializing this ledger node, you authorize automated audit protocols and decentralized management.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full h-16 shadow-neon" 
                loading={isLoading}
              >
                Deploy Workspace <ChevronRight size={20} className="ml-2" strokeWidth={3} />
              </Button>
            </div>
          </form>

          <p className="pb-10 text-center text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary">
            Legacy user?{' '}
            <Link to="/login" className="text-accent hover:text-white transition-all underline underline-offset-8 decoration-2 shadow-neon/10">
              Access Terminal
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
