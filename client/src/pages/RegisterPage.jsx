import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, UserPlus, ChevronRight, Hexagon, Shield, CheckCircle2, Activity, Globe, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import GlassInput from '../components/ui/GlassInput';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

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
      toast.success('Provisioning complete. Initialize terminal access.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.error || 'Provisioning failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-bg-base overflow-hidden">
      {/* Left Panel - Hero Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-hero flex-col justify-between p-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-accent-teal/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-blue/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(var(--color-text-dim) 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="text-accent-teal">
              <Hexagon size={32} fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">
              Fin<span className="text-accent-teal">Ledger</span>
            </h1>
          </div>

          <div className="max-w-lg space-y-6">
            <h2 className="text-6xl font-extrabold text-text-primary leading-[1.1] tracking-tight">
              Provisioning for the <span className="text-accent-teal">next generation</span> of finance.
            </h2>
            <p className="text-xl text-text-secondary font-medium max-w-md">
              Securely initialize your identity on the FinLedger institutional-grade decentralized node.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-12">
          <div className="flex flex-wrap gap-8">
            {[
              { label: 'Cloud Infrastructure', icon: Globe },
              { label: 'Role Governance', icon: Shield },
              { label: 'Identity Vault', icon: CheckCircle2 },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-accent-teal group-hover:bg-accent-teal/10 transition-colors">
                  <badge.icon size={18} />
                </div>
                <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-text-secondary group-hover:text-text-primary transition-colors">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-text-dim/60">
            <Activity size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Node Deployment Status: Nominal</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-bg-surface border-l border-bg-border relative modern-scrollbar overflow-y-auto">
        <div className="w-full max-w-md px-10 py-20 space-y-10 animate-in">
          <div className="space-y-4">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-teal">New Provisioning Session</span>
            <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">Create Identity</h2>
            <p className="text-text-secondary font-medium text-sm">Initialize your node settings and security protocols.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <GlassInput 
                label="Network Identity"
                placeholder="abc"
                icon={User}
                {...register('name', { required: 'Identity identifier required' })}
                error={errors.name?.message}
              />
              
              <GlassInput 
                label="Contact Protocol"
                type="email"
                placeholder="root@finledger.sys"
                icon={Mail}
                {...register('email', { 
                  required: 'Email required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid protocol format' }
                })}
                error={errors.email?.message}
              />

              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-[0.08em] ml-1 text-text-secondary">
                  Access Tier
                </label>
                <div className="relative group">
                  <select 
                    className="w-full h-11 bg-bg-base border border-bg-border text-text-primary text-sm px-4 rounded-btn transition-all duration-200 outline-none uppercase tracking-widest appearance-none cursor-pointer focus:border-accent-teal/60 ring-accent-teal/10 focus:ring-2 bg-no-repeat bg-[right_1rem_center]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233D6080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                    {...register('role', { required: 'Tier configuration required' })}
                  >
                    <option value="user" className="bg-bg-surface">Baseline Access</option>
                    <option value="analyst" className="bg-bg-surface">Intelligence Analyst</option>
                    <option value="admin" className="bg-bg-surface">Infrastructure Root</option>
                  </select>
                </div>
                {errors.role && <p className="text-[0.65rem] font-bold text-accent-red/80 ml-1 uppercase tracking-wider">{errors.role.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <GlassInput 
                  label="Security Key"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  {...register('password', { 
                    required: 'Key required',
                    minLength: { value: 6, message: 'Min 6 chars' }
                  })}
                  error={errors.password?.message}
                />
                <GlassInput 
                  label="Verify Key"
                  type="password"
                  placeholder="••••••••"
                  icon={Shield}
                  {...register('confirmPassword', { 
                    required: 'Verification required',
                    validate: (val) => val === password || 'Mismatch'
                  })}
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-accent-teal/5 border border-accent-teal/10 space-y-2">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-accent-teal">Security Policy</p>
              <p className="text-[0.6rem] text-text-secondary leading-normal font-medium max-w-xs">
                By provisioning this node, you authorize FinLedger to perform automated audits and sovereign encryption protocols.
              </p>
            </div>

            <Button type="submit" loading={isLoading} className="w-full h-12 shadow-teal-glow">
              Initialize Provisioning <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm font-medium text-text-secondary">
              Existing node owner?{' '}
              <Link to="/login" className="text-accent-teal font-bold hover:underline underline-offset-4">
                Access Terminal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
