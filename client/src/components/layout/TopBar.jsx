import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import NotificationDropdown from '../ui/NotificationDropdown';
import { dashboardApi } from '../../api/dashboard.api';
import GlassInput from '../ui/GlassInput';

import { cn } from '../../utils/cn';

const TopBar = () => {
  const auth = useAuth() || {};
  const { user } = auth;
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef(null);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Intelligence Overview';
    if (path === '/transactions') return 'Transactional Ledger';
    if (path === '/users') return 'Network Directory';
    if (path === '/profile') return 'Security Settings';
    if (path === '/status') return 'Infrastructure Status';
    return 'Command Console';
  };

  const getBreadcrumb = () => {
    const path = location.pathname.split('/').filter(Boolean);
    return path.map((p, i) => (
      <React.Fragment key={i}>
        {i > 0 && <ChevronRight size={12} className="text-text-dim mx-1" />}
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
          {p.replace('-', ' ')}
        </span>
      </React.Fragment>
    ));
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-8 bg-bg-base/95 backdrop-blur-xl border-b border-bg-border transition-all duration-200">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-0.5">
          {getBreadcrumb()}
        </div>
        <h2 className="text-lg font-bold text-text-primary tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:block w-80">
          <GlassInput 
            icon={Search} 
            placeholder="Search core intelligence..." 
            className="h-10"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setHasUnread(false);
              }}
              className="relative p-2 rounded-btn text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-150"
            >
              <Bell size={20} />
              {hasUnread && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-teal shadow-teal-glow animate-pulse" />
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-full pt-2">
                <NotificationDropdown 
                  notifications={notifications} 
                  onMarkRead={() => setHasUnread(false)}
                  onClose={() => setShowNotifications(false)}
                />
              </div>
            )}
          </div>
          
          <div className="h-8 w-px bg-bg-border hidden sm:block" />
          
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-text-primary leading-tight">{user?.name}</span>
              <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
