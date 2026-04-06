import React, { Component } from 'react';
import { AlertCircle, RotateCcw, Home, ShieldCheck } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Core Logic Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center p-6 text-center">
          <div className="absolute inset-0 bg-expense/5 blur-[120px] pointer-events-none" />
          
          <div className="max-w-md w-full space-y-8 relative z-10">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-bg-surface border border-expense/30 text-expense shadow-[0_0_40px_rgba(255,77,109,0.1)]">
              <AlertCircle size={40} strokeWidth={2.5} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold text-white tracking-tight uppercase italic">
                System<span className="text-expense">Failure</span>
              </h1>
              <p className="text-text-secondary text-sm leading-relaxed">
                A critical logic exception has occurred in the application core. The secure session has been isolated to prevent data leakage.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-expense hover:bg-expense/80"
              >
                <RotateCcw size={18} className="mr-2" /> Reboot Application
              </Button>
              <Button 
                variant="secondary"
                onClick={() => window.location.href = '/status'} 
                className="w-full border-bg-border text-white"
              >
                <ShieldCheck size={18} className="mr-2" /> Enter Diagnostic Mode
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/dashboard'} 
                className="w-full text-text-muted hover:text-white"
              >
                <Home size={18} className="mr-2" /> Return to HQ
              </Button>
            </div>

            <div className="pt-8 border-t border-bg-border/30">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest leading-relaxed">
                    Exception Hash: {Math.random().toString(16).substring(2, 10).toUpperCase()} <br/>
                    Isolated Environment: {this.state.error?.name || 'GENERIC_CRASH'}
                </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
