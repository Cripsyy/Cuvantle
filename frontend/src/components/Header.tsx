import React, { useState } from 'react';
import Progress from './Progress';

interface HeaderProps {
  onStatsClick?: () => void;
  onHelpClick?: () => void;
  onSettingsClick?: () => void;
  onHintClick?: () => void;
  onBackToMenu?: () => void;
  isProgressiveMode?: boolean;
  progressiveLevel?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onStatsClick, 
  onHelpClick, 
  onSettingsClick,
  onHintClick,
  onBackToMenu, 
  isProgressiveMode,
  progressiveLevel,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="py-2 border-b border-gray-300 sm:py-4 dark:border-gray-600">
      <div className="container px-2 mx-auto sm:px-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center justify-start w-24 sm:w-32">
            {onBackToMenu && (
              <button 
                onClick={onBackToMenu}
                className="p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Înapoi la meniu"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Center - Title and Progress */}
          <div className="flex flex-col items-center justify-center flex-1">
            
            {isProgressiveMode && progressiveLevel ? (
              <>
                <h1 className="hidden text-xl font-bold text-center md:block sm:text-2xl md:text-3xl">CUVÂNTLE</h1>
                <Progress 
                  progressiveLevel={progressiveLevel} 
                />
              </>
            ) : (
              <h1 className="text-xl font-bold text-center md:block sm:text-2xl md:text-3xl">CUVÂNTLE</h1>
            )}
          </div>
          
          {/* Right side - Action buttons */}
          <div className="flex items-center justify-end w-24 gap-1 sm:w-32 sm:gap-2">
            {/* Desktop buttons - hidden on mobile */}
            <div className="items-center hidden gap-1 sm:flex sm:gap-2">
              <button 
                onClick={onHelpClick}
                className="p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Ajutor"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <button
                onClick={onHintClick}
                className="p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Indiciu"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19.5H14M10.6667 22H13.3333" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.41058 13.6805L8.51463 14.7196C8.82437 15.0112 9 15.4177 9 15.843C9 16.482 9.518 17 10.157 17H13.843C14.482 17 15 16.482 15 15.843C15 15.4177 15.1756 15.0112 15.4854 14.7196L16.5894 13.6805C18.1306 12.2187 18.9912 10.2984 18.9999 8.30193L19 8.21807C19 4.8069 15.866 2 12 2C8.13401 2 5 4.8069 5 8.21807L5.00007 8.30193C5.00875 10.2984 5.86939 12.2187 7.41058 13.6805Z" />
                </svg>
              </button>

              <button 
                onClick={onSettingsClick}
                className="p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Setări"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button 
                onClick={onStatsClick}
                className="p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Statistici"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="relative sm:hidden">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-1.5 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Meniu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Mobile dropdown menu */}
              {showMobileMenu && (
                <div className="absolute right-0 z-50 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full dark:bg-gray-800 dark:border-gray-600">
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        onHelpClick?.();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center w-full gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ajutor
                    </button>
                    
                    <button 
                      onClick={() => {
                        onHintClick?.();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center w-full gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19.5H14M10.6667 22H13.3333" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.41058 13.6805L8.51463 14.7196C8.82437 15.0112 9 15.4177 9 15.843C9 16.482 9.518 17 10.157 17H13.843C14.482 17 15 16.482 15 15.843C15 15.4177 15.1756 15.0112 15.4854 14.7196L16.5894 13.6805C18.1306 12.2187 18.9912 10.2984 18.9999 8.30193L19 8.21807C19 4.8069 15.866 2 12 2C8.13401 2 5 4.8069 5 8.21807L5.00007 8.30193C5.00875 10.2984 5.86939 12.2187 7.41058 13.6805Z" />
                      </svg>
                      Indiciu
                    </button>
                    
                    <button 
                      onClick={() => {
                        onSettingsClick?.();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center w-full gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Setări
                    </button>
                    
                    <button 
                      onClick={() => {
                        onStatsClick?.();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center w-full gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Statistici
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Click outside to close mobile menu */}
        {showMobileMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMobileMenu(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
