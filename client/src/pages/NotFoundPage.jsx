import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Home, AlertTriangle, ShieldAlert, Terminal, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in">
      <div className="relative mb-16 group">
        <div className="absolute inset-0 bg-accent-red/20 blur-[100px] rounded-full scale-150 opacity-50 group-hover:opacity-80 transition-opacity" />
        <h1 className="text-[180px] font-extrabold text-bg-surface-elevated leading-none tracking-tighter opacity-20 relative z-10 selection:bg-accent-red/30">404</h1>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <ShieldAlert size={100} strokeWidth={1.5} className="text-accent-red animate-pulse drop-shadow-red" />
        </div>
      </div>
      
      <div className="space-y-4 max-w-lg relative z-10">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-accent-red mb-2 block">Protocol Exception / 0x404</span>
        <h3 className="text-4xl font-extrabold text-text-primary tracking-tight">
          Destination <span className="text-accent-red">Undefined</span>
        </h3>
        <p className="text-text-dim text-lg font-medium leading-relaxed">
          The requested ledger segment could not be located on any active shards. 
          The node address may have been purged or relocated.
        </p>
      </div>

      <div className="mt-12 flex items-center gap-6 relative z-10">
        <Link to="/dashboard">
          <Button size="lg" className="h-14 px-10 shadow-teal-glow">
            <Home size={20} className="mr-3" /> Return to Command Center
          </Button>
        </Link>
        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-dim hover:text-white transition-all">
          <Terminal size={16} /> Open Debug Console <ChevronRight size={14} />
        </button>
      </div>

      <div className="mt-20 pt-10 border-t border-bg-border w-full max-w-2xl opacity-40">
         <div className="flex items-center justify-center gap-10 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-text-dim">
            <span>Node: GAL-EXT-99</span>
            <span>Error_Code: ERR_SEGMENT_FAULT</span>
            <span>Entropy: 0.942</span>
         </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
