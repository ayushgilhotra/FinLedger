import { cn } from '../../utils/cn';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { TrendingUp, TrendingDown, ArrowRight, CheckCircle2, Inbox } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';


const NotificationDropdown = ({ notifications = [], onMarkRead, onClose }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 overflow-hidden rounded-2xl border border-bg-border bg-bg-surface/80 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between border-b border-bg-border px-4 py-3 bg-bg-surface/50">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            onClick={onMarkRead}
            className="flex items-center gap-1.5 text-[10px] font-bold text-accent hover:text-accent/80 transition-colors uppercase"
          >
            <CheckCircle2 size={12} /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
        {notifications.length > 0 ? (
          <div className="divide-y divide-bg-border/50">
            {notifications.map((notif, index) => (
              <div 
                key={notif.id || index}
                className="group relative flex items-start gap-4 p-4 hover:bg-bg-elevated/50 transition-all duration-300 cursor-pointer"
              >
                <div className={cn(
                  "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                  notif.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
                )}>
                  {notif.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-text-primary uppercase tracking-tight truncate max-w-[140px]">
                        {notif.category}
                    </p>
                    <span className="text-[10px] font-bold text-text-muted/60">
                      {formatDistanceToNow(new Date(notif.date || notif.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn(
                      "text-sm font-mono font-bold",
                      notif.type === 'income' ? 'text-income' : 'text-expense'
                    )}>
                      {notif.type === 'income' ? '+' : '-'}{formatCurrency(notif.amount)}
                    </span>
                    <span className="text-[10px] text-text-muted italic truncate max-w-[100px]">
                      {notif.description || 'Ledger Update'}
                    </span>
                  </div>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} className="text-accent" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated text-text-muted/40">
              <Inbox size={24} />
            </div>
            <p className="text-sm font-bold text-text-secondary italic">Everything caught up!</p>
            <p className="mt-1 text-[10px] text-text-muted uppercase tracking-widest leading-relaxed">
              New transactions and system alerts will appear here.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-bg-border bg-bg-surface/50 p-3">
        <button 
          onClick={onClose}
          className="w-full rounded-xl bg-bg-elevated py-2 text-center text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:bg-bg-border hover:text-text-primary transition-all duration-200"
        >
          View Activity History
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
