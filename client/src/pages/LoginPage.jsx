import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TrendingUp, Mail, Lock, LogIn, ShieldCheck, Shield, LineChart, User as UserIcon, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  const fillCredentials = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  const demoAccounts = [
    { 
      role: 'Admin', 
      email: 'admin@finance.com', 
      password: 'admin123', 
      icon: <ShieldCheck size={18} strokeWidth={3} />,
      color: 'text-accent',
      desc: 'Full Infrastructure Governance'
    },
    { 
      role: 'Analyst', 
      email: 'analyst@finance.com', 
      password: 'analyst123', 
      icon: <LineChart size={18} strokeWidth={3} />,
      color: 'text-income',
      desc: 'Expert Financial Intelligence'
    },
    { 
      role: 'User', 
      email: 'user@finance.com', 
      password: 'user123', 
      icon: <UserIcon size={18} strokeWidth={3} />,
      color: 'text-text-secondary',
      desc: 'Baseline Portfolio Access'
    },
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg-base p-6 relative overflow-hidden py-20">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] h-[70%] w-[70%] rounded-full bg-accent/5 blur-[150px]" />
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
            <p className="text-text-secondary text-lg font-black tracking-[0.2em] uppercase text-center">Identity & Access Gateway</p>
          </div>
        </div>

        <Card variant="glass" className="p-2 border-white/10 shadow-2xl backdrop-blur-3xl rounded-[3rem]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 p-8">
            <div className="space-y-8">
                <Input
                  label="Auth Identifier"
                  type="email"
                  placeholder="name@company.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  error={errors.email?.message}
                />
              
                <Input
                  label="Security Shield Key"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters required' }
                  })}
                  error={errors.password?.message}
                />
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 shadow-neon" 
              loading={isLoading}
            >
              Authorize System <ChevronRight size={20} className="ml-2" strokeWidth={3} />
            </Button>
          </form>

          {/* Quick Access Grid */}
          <div className="px-8 pb-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">Node Access Profiles</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  onClick={() => fillCredentials(account.email, account.password)}
                  className="group flex items-center justify-between p-5 rounded-[2rem] border border-white/5 bg-bg-base/40 hover:bg-white/5 hover:border-accent/30 transition-all duration-300 text-left active:scale-[0.98]"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl bg-bg-base border border-white/5 ${account.color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                      {account.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-widest mb-0.5">{account.role} Governance</div>
                      <div className="text-[10px] text-text-secondary font-black tracking-tight uppercase opacity-80">{account.desc}</div>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-full blur-[0.4px] bg-accent/10 border border-accent/20 text-[10px] font-black text-accent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-2">
                    DEPLOY <ChevronRight size={10} strokeWidth={4} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pb-10 text-center space-y-6">
             <p className="text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary">
              Unauthorized identity?{' '}
              <Link to="/register" className="text-accent hover:text-white transition-all underline underline-offset-8 decoration-2 shadow-neon/10 ml-2">
                Provision Account
              </Link>
            </p>
            <div className="h-px w-20 bg-white/5 mx-auto" />
            <Link 
              to="/status" 
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-accent transition-all duration-300"
            >
              <Shield size={14} strokeWidth={3} /> Core Diagnostic Terminal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

