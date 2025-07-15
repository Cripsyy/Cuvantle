import React from 'react';

interface HeaderProps {
  onStatsClick?: () => void;
  onHelpClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStatsClick, onHelpClick }) => {
  return (
    <header className="border-b border-gray-300 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <button 
          onClick={onHelpClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Ajutor"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <h1 className="text-3xl font-bold text-center">CUVÂNTLE</h1>
        
        <button 
          onClick={onStatsClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Statistici"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
