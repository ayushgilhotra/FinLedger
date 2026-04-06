import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-10">
        <h1 className="text-[150px] font-display font-black text-bg-elevated leading-none tracking-tighter">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <SearchX size={80} className="text-accent animate-bounce" />
        </div>
      </div>
      
      <h3 className="text-3xl font-display font-bold text-white uppercase italic tracking-tight mb-4">
        Destination <span className="text-expense">Undefined</span>
      </h3>
      <p className="text-text-secondary max-w-sm mb-10 text-lg">
        The ledger entry you are searching for does not exist or has been archived in the void.
      </p>

      <Link to="/dashboard">
        <Button size="lg" className="h-14 px-10">
          <Home size={20} className="mr-3" /> Return to Safe Harbor
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
