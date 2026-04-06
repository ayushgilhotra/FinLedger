import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TrendingUp, Mail, Lock, LogIn, ShieldCheck, Shield, LineChart, User as UserIcon } from 'lucide-react';
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
      icon: <ShieldCheck size={16} />,
      color: 'text-accent'
    },
    { 
      role: 'Analyst', 
      email: 'analyst@finance.com', 
      password: 'analyst123', 
      icon: <LineChart size={16} />,
      color: 'text-income'
    },
    { 
      role: 'User', 
      email: 'user@finance.com', 
      password: 'user123', 
      icon: <UserIcon size={16} />,
      color: 'text-text-secondary'
    },
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg-base p-4 relative overflow-hidden py-12">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-expense/10 blur-[120px]" />

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-bg-base shadow-glow mb-4">
            <TrendingUp size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-normal text-white uppercase">
            Fin<span className="text-accent">Ledger</span>
          </h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Welcome back. Enter your credentials to access your gateway.</p>
        </div>

        <Card className="glass shadow-2xl border-bg-border/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute right-4 top-10 text-text-muted transition-colors group-focus-within:text-accent" size={18} />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  error={errors.email?.message}
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute right-4 top-10 text-text-muted" size={18} />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters required' }
                  })}
                  error={errors.password?.message}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-bold uppercase tracking-widest" 
              loading={isLoading}
            >
              Sign In to Ledger <LogIn size={18} className="ml-2" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-accent hover:underline underline-offset-4">
              Create one for free
            </Link>
          </p>
        </Card>

        {/* Demo Credentials Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-bg-border/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Quick Access Demo Profiles</span>
            <div className="h-px flex-1 bg-bg-border/50" />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                onClick={() => fillCredentials(account.email, account.password)}
                className="group flex items-center justify-between p-3 rounded-xl border border-bg-border/30 bg-bg-card/30 hover:bg-accent/5 hover:border-accent/30 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-bg-base border border-bg-border/50 ${account.color} group-hover:scale-110 transition-transform`}>
                    {account.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{account.role} Access</div>
                    <div className="text-[10px] text-text-muted font-mono">{account.email}</div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Autofill <LogIn size={10} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
          <Link 
            to="/status" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          >
            <Shield size={12} /> System Diagnostic Mode
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

