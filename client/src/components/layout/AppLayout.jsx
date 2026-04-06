import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-bg-base modern-scrollbar">
      {/* Sidebar - Fixed Width */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-[240px]">
        <TopBar />
        
        <main className="flex-1 p-8 lg:p-10 animate-in overflow-x-hidden">
          <div className="max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
