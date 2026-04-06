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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-bg-border bg-bg-surface flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 gap-3">
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-bg-base">
          <TrendingUp size={20} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-display font-bold tracking-tight text-white uppercase italic">
          Fin<span className="text-accent underline underline-offset-4 decoration-2">Ledger</span>
        </h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
              isActive 
                ? 'bg-bg-elevated text-accent border-l-4 border-accent pl-2' 
                : 'text-text-secondary hover:bg-bg-elevated/50 hover:text-text-primary'
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              "group-hover:text-accent"
            )} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-bg-border p-4 bg-bg-base/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-bg-base font-bold shadow-glow">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
            <Badge variant={user?.role} className="mt-0.5">{user?.role}</Badge>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-expense hover:bg-expense/10 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
