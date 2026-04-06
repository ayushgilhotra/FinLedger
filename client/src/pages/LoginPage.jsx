import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, ShieldCheck, Shield, LineChart, User as UserIcon, ChevronRight, Activity, Globe, CheckCircle2, Hexagon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import GlassInput from '../components/ui/GlassInput';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = {
    admin: { email: 'admin@finance.com', password: 'admin123', label: 'Infrastructure Root' },
    analyst: { email: 'analyst@finance.com', password: 'analyst123', label: 'Intelligence Tier' },
    user: { email: 'user@finance.com', password: 'user123', label: 'Standard Access' },
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const account = demoAccounts[role];
    setValue('email', account.email);
    setValue('password', account.password);
  };

  return (
    <div className="flex min-h-screen w-full bg-bg-base overflow-hidden">
      {/* Left Panel - Hero Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-hero flex-col justify-between p-20">
        {/* Abstract Artwork Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-accent-teal/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-blue/10 rounded-full blur-[100px]" />
          
          {/* Grid pattern overlay */}
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
              The architecture of <span className="text-accent-teal">precision</span> finance.
            </h2>
            <p className="text-xl text-text-secondary font-medium max-w-md">
              Securely orchestrating multi-role financial intelligence for elite institutional governance.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-12">
          <div className="flex flex-wrap gap-8">
            {[
              { label: 'Secure Access', icon: Shield },
              { label: 'Role Protected', icon: CheckCircle2 },
              { label: 'Real-time Data', icon: Activity },
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
            <Globe size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Grade Node • 0X-F-442</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-bg-surface border-l border-bg-border relative">
        <div className="w-full max-w-md px-10 space-y-10 animate-in">
          <div className="space-y-4">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-accent-teal">Systems online</span>
            <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">Sign in to Terminal</h2>
            <p className="text-text-secondary font-medium">Access your financial command center below.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <GlassInput 
                label="Auth Identifier"
                type="email"
                placeholder="root@finledger.sys"
                icon={Mail}
                {...register('email', { required: 'Identifier required' })}
                error={errors.email?.message}
              />
              <GlassInput 
                label="Security Key"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                {...register('password', { required: 'Key required' })}
                error={errors.password?.message}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-bg-border bg-bg-base text-accent-teal focus:ring-accent-teal/30" />
                <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors">Remember Node</span>
              </label>
              <button type="button" className="text-xs font-bold text-accent-blue hover:text-accent-teal transition-colors">
                Recover Key?
              </button>
            </div>

            <Button type="submit" loading={isLoading} className="w-full h-12 shadow-teal-glow">
              Initialize Terminal Access <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-bg-border" /></div>
              <div className="relative flex justify-center text-[0.65rem] uppercase font-bold tracking-[0.2em]">
                <span className="bg-bg-surface px-4 text-text-dim">Role Selection Profile</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {Object.keys(demoAccounts).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={cn(
                    "py-2.5 rounded-btn border text-[0.65rem] font-bold uppercase tracking-widest transition-all duration-200",
                    selectedRole === role 
                      ? "bg-accent-teal/10 border-accent-teal text-accent-teal shadow-teal-glow" 
                      : "bg-bg-base border-bg-border text-text-dim hover:border-text-secondary hover:text-text-primary"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
            
            {selectedRole && (
              <p className="text-center text-[0.6rem] font-bold text-text-dim tracking-widest uppercase animate-in fade-in">
                Selected: {demoAccounts[selectedRole].label}
              </p>
            )}
          </div>

          <div className="text-center pt-4">
            <p className="text-sm font-medium text-text-secondary">
              Provision new access?{' '}
              <Link to="/register" className="text-accent-teal font-bold hover:underline underline-offset-4">
                Initialize Provisioning
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

