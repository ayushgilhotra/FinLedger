import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  UserCircle, 
  LogOut,
  BarChart3,
  FileText,
  Activity,
  Settings,
  Hexagon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { cn } from '../../utils/cn';

const Sidebar = () => {
  const auth = useAuth() || {};
  const { user, logout } = auth;
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'analyst', 'user'] },
        { label: 'Transactions', icon: ArrowLeftRight, path: '/transactions', roles: ['admin', 'analyst', 'user'] },
        { label: 'Analytics', icon: BarChart3, path: '/leaderboard', roles: ['admin', 'analyst', 'user'] },
      ]
    },
    {
      title: 'Management',
      roles: ['admin', 'analyst'],
      items: [
        { label: 'Users', icon: Users, path: '/users', roles: ['admin'] },
        { label: 'Reports', icon: FileText, path: '/investors', roles: ['admin', 'analyst'] },
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Status', icon: Activity, path: '/status', roles: ['admin', 'analyst', 'user'] },
        { label: 'Settings', icon: Settings, path: '/profile', roles: ['admin', 'analyst', 'user'] },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'teal';
      case 'analyst': return 'purple';
      default: return 'blue';
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] bg-bg-base border-r border-bg-border flex flex-col transition-all duration-300">
      {/* Logo */}
      <div className="flex h-20 items-center px-6 gap-3">
        <div className="text-accent-teal">
          <Hexagon size={24} fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Fin<span className="text-accent-teal">Ledger</span>
        </h1>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-4 modern-scrollbar">
        {sections.map((section, idx) => {
          const visibleItems = section.items.filter(item => item.roles.includes(user?.role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="mb-8">
              <h3 className="px-6 mb-3 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-text-dim/60">
                {section.title}
              </h3>
              <div className="space-y-1">
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 px-6 py-2.5 text-[0.875rem] font-medium transition-all duration-150 relative group',
                      isActive 
                        ? 'text-accent-teal bg-accent-teal/5' 
                        : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-teal rounded-r-full shadow-teal-glow" />}
                        <item.icon size={18} className={cn(
                          "transition-colors",
                          isActive ? "text-accent-teal" : "group-hover:text-text-primary"
                        )} />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-bg-border bg-bg-base/50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-btn font-bold text-bg-base shadow-sm",
            `bg-accent-${getRoleColor(user?.role)}`
          )}>
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
            <Badge variant={getRoleColor(user?.role)} className="mt-0.5">
              {user?.role}
            </Badge>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-btn text-[0.75rem] font-bold uppercase tracking-widest text-text-secondary hover:bg-white/5 hover:text-accent-red border border-transparent hover:border-accent-red/20 transition-all duration-200"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
