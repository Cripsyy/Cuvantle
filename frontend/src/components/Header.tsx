import React from 'react';

interface HeaderProps {
  onStatsClick?: () => void;
  onHelpClick?: () => void;
  onSettingsClick?: () => void;
  onHintClick?: () => void;
  onBackToMenu?: () => void;
  isProgressiveMode?: boolean;
  progressiveLevel?: number;
  maxProgressiveLevel?: number; 
}

const Header: React.FC<HeaderProps> = ({ 
  onStatsClick, 
  onHelpClick, 
  onSettingsClick,
  onHintClick,
  onBackToMenu, 
  isProgressiveMode,
  progressiveLevel,
  maxProgressiveLevel
}) => {

  const wordLengths = [3, 4, 5, 6, 7, 8, 9];

  // Difficulty color functions (same as Home page)
  const getDifficultyColor = (length: number): string => {
    if (length <= 4) return 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600';
    if (length <= 6) return 'bg-yellow-500 border-yellow-500 dark:bg-yellow-600 dark:border-yellow-600';
    return 'bg-red-500 border-red-500 dark:bg-red-600 dark:border-red-600';
  };

  return (
    <header className="py-4 border-b border-gray-300 dark:border-gray-600">
      <div className="container mx-auto">
        <div className="grid items-center grid-cols-3">
          <div className="flex justify-start">
            {onBackToMenu && (
              <button 
                onClick={onBackToMenu}
                className="p-2 mr-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Înapoi la meniu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">CUVÂNTLE</h1>
            {isProgressiveMode && progressiveLevel && maxProgressiveLevel != null && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex justify-center mt-2">
                  {/* Render bullet indicators for progressive levels */}
                  {wordLengths.map(level => (
                    <div key={level} className="relative mx-1">
                      <div className={`w-4 h-4 rounded-full border-2 transition-all ${getDifficultyColor(level)}`}/>
                      {/* Arrow indicator for current level */}
                      {level === progressiveLevel && (
                        <div className="absolute transform -translate-x-1/2 top-4 left-1/2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 14l5-5 5 5z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={onHelpClick}
              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Ajutor"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button
              onClick={onHintClick}
              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Indiciu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19.5H14M10.6667 22H13.3333" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.41058 13.6805L8.51463 14.7196C8.82437 15.0112 9 15.4177 9 15.843C9 16.482 9.518 17 10.157 17H13.843C14.482 17 15 16.482 15 15.843C15 15.4177 15.1756 15.0112 15.4854 14.7196L16.5894 13.6805C18.1306 12.2187 18.9912 10.2984 18.9999 8.30193L19 8.21807C19 4.8069 15.866 2 12 2C8.13401 2 5 4.8069 5 8.21807L5.00007 8.30193C5.00875 10.2984 5.86939 12.2187 7.41058 13.6805Z" />
              </svg>
            </button>

            <button 
              onClick={onSettingsClick}
              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Setări"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
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
