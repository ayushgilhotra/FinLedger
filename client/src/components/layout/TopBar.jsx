import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import NotificationDropdown from '../ui/NotificationDropdown';
import { dashboardApi } from '../../api/dashboard.api';

const TopBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef(null);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/transactions') return 'Journal';
    if (path.startsWith('/transactions/')) return 'Transaction Analysis';
    if (path === '/users') return 'Registry';
    if (path === '/profile') return 'Account Settings';
    if (path === '/leaderboard') return 'Performance Index';
    if (path === '/history') return 'Settlements';
    if (path === '/top-investors') return 'Capital Markets';
    return '';
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await dashboardApi.getRecent();
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between px-10 glass transition-all duration-500">
      <h2 className="text-2xl font-display font-black text-white tracking-[0.05em] uppercase">
        {getPageTitle()}
      </h2>

      <div className="flex items-center gap-10">
        {/* Search Placeholder */}
        <div className="relative hidden lg:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent" size={18} />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            className="h-11 w-80 rounded-full border border-white/5 bg-bg-surface/50 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all focus:bg-bg-elevated/80"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setHasUnread(false);
              }}
              className="relative p-2.5 rounded-2xl text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <Bell size={22} strokeWidth={2.5} />
              {hasUnread && (
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-bg-base shadow-neon animate-pulse" />
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-full pt-4">
                <NotificationDropdown 
                  notifications={notifications} 
                  onMarkRead={() => setHasUnread(false)}
                  onClose={() => navigate('/transactions')}
                />
              </div>
            )}
          </div>
          
          <div className="h-10 w-px bg-white/5 hidden sm:block" />
          
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">{user?.name}</span>
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] leading-none opacity-90">
              {user?.role} Access
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
