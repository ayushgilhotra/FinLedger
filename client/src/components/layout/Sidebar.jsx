import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  UserCircle, 
  LogOut,
  TrendingUp,
  ReceiptText,
  Trophy,
  LineChart
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(...inputs));

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'analyst', 'user'] },
    { label: 'Journal', icon: ArrowLeftRight, path: '/transactions', roles: ['admin', 'analyst', 'user'] },
    { label: 'Payment History', icon: ReceiptText, path: '/history', roles: ['admin', 'analyst', 'user'] },
    { label: 'Leaderboard', icon: Trophy, path: '/leaderboard', roles: ['admin', 'analyst', 'user'] },
    { label: 'Top Investors', icon: LineChart, path: '/investors', roles: ['admin', 'analyst'] },
    { label: 'Users', icon: Users, path: '/users', roles: ['admin'] },
    { label: 'Profile', icon: UserCircle, path: '/profile', roles: ['admin', 'analyst', 'user'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-white/5 glass flex flex-col transition-all duration-500">
      {/* Logo */}
      <div className="flex h-24 items-center px-10 gap-4">
        <div className="h-10 w-10 rounded-2xl bg-accent flex items-center justify-center text-bg-base shadow-neon">
          <TrendingUp size={24} strokeWidth={3} />
        </div>
        <h1 className="text-2xl font-display font-black tracking-tight text-white uppercase italic">
          Fin<span className="text-accent">Ledger</span>
        </h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2 px-6 py-6 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'group flex items-center gap-4 rounded-[1.5rem] px-5 py-3.5 text-sm font-bold uppercase tracking-widest transition-all duration-300',
              isActive 
                ? 'glass-light text-accent shadow-sm translate-x-1 outline outline-1 outline-accent/20' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            )}
          >
            <item.icon size={20} className={cn(
              "transition-all duration-300",
              "group-hover:scale-110"
            )} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-white/5 p-8 glass-light">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-bg-base font-black shadow-neon">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-black text-white truncate uppercase tracking-tight">{user?.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-accent mt-0.5">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl px-3 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-expense hover:bg-expense/10 border border-expense/20 transition-all duration-300 active:scale-95"
        >
          <LogOut size={16} strokeWidth={3} />
          Logout System
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
