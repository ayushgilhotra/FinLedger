import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TrendingUp, User, Mail, Lock, UserPlus } from 'lucide-react';
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg-base p-4 relative overflow-hidden py-10">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-expense/10 blur-[120px]" />

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-bg-base shadow-glow mb-4">
            <TrendingUp size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-white uppercase italic">
            Fin<span className="text-accent">Ledger</span>
          </h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Create your secure finance workspace.</p>
        </div>

        <Card className="glass shadow-2xl border-bg-border/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute right-4 top-10 text-text-muted transition-colors group-focus-within:text-accent" size={18} />
                <Input
                  label="Full Name"
                  placeholder="abc"
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                />
              </div>

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
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Assigned Role</label>
                  <select 
                    className="w-full h-12 px-4 rounded-xl border border-bg-border/50 bg-bg-elevated text-white text-sm focus:outline-none focus:border-accent/80 transition-all appearance-none cursor-pointer hover:bg-bg-elevated/80"
                    {...register('role', { required: 'Role is required' })}
                  >
                    <option value="user" className="bg-[#111111] text-white">Regular User (Financial Baseline)</option>
                    <option value="analyst" className="bg-[#111111] text-white">Financial Analyst (Expert Analysis)</option>
                    <option value="admin" className="bg-[#111111] text-white">System Admin (Full Authorization)</option>
                  </select>
                  {/* Custom Arrow for select */}
                  <div className="pointer-events-none absolute right-4 top-[2.4rem] text-text-muted">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
                {errors.role && <p className="mt-1 text-[10px] font-bold text-expense font-display ml-1">{errors.role.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password', { 
                      required: 'Required',
                      minLength: { value: 6, message: 'Min 6 chars' }
                    })}
                    error={errors.password?.message}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Confirm"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword', { 
                      required: 'Required',
                      validate: (val) => val === password || 'No match'
                    })}
                    error={errors.confirmPassword?.message}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-bold uppercase tracking-widest" 
              loading={isLoading}
            >
              Initialize Workspace <UserPlus size={18} className="ml-2" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-accent hover:underline underline-offset-4">
              Sign in here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
