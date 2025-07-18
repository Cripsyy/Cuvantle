import React from 'react';

interface HeaderProps {
  onStatsClick?: () => void;
  onHelpClick?: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStatsClick, onHelpClick, isDarkMode, onDarkModeToggle }) => {
  return (
    <header className="py-4 border-b border-gray-300 dark:border-gray-600">
      <div className="container px-4 mx-auto">
        <div className="grid items-center grid-cols-3">
          <div className="flex justify-start">
            <button 
              onClick={onHelpClick}
              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Ajutor"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold">CUVÂNTLE</h1>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={onDarkModeToggle}
              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title={isDarkMode ? "Mod luminos" : "Mod întunecat"}
            >
              {isDarkMode ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={onStatsClick}
              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Statistici"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
