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
    if (path === '/transactions') return 'Transactions';
    if (path.startsWith('/transactions/')) return 'Transaction Details';
    if (path === '/users') return 'User Management';
    if (path === '/profile') return 'My Profile';
    if (path === '/leaderboard') return 'Leaderboard';
    if (path === '/history') return 'Payment History';
    if (path === '/top-investors') return 'Top Investors';
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-bg-border bg-bg-base/60 px-8 backdrop-blur-md">
      <h2 className="text-xl font-display font-bold text-text-primary tracking-tight uppercase">
        {getPageTitle()}
      </h2>

      <div className="flex items-center gap-6">
        {/* Search Placeholder */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="h-9 w-64 rounded-full border border-bg-border bg-bg-surface pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all focus:bg-bg-elevated"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setHasUnread(false);
              }}
              className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-all duration-300"
            >
              <Bell size={20} />
              {hasUnread && (
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-bg-base animate-pulse" />
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-full">
                <NotificationDropdown 
                  notifications={notifications} 
                  onMarkRead={() => setHasUnread(false)}
                  onClose={() => navigate('/transactions')}
                />
              </div>
            )}
          </div>
          
          <div className="h-8 w-px bg-bg-border hidden sm:block" />
          
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-text-primary uppercase tracking-tight">{user?.name}</span>
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] leading-tight opacity-80">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
