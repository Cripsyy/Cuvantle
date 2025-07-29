import React from 'react';

interface LandingPageProps {
  onWordLengthSelect: (wordLength: number) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onWordLengthSelect, isDarkMode, onDarkModeToggle }) => {
  const wordLengths = [3, 4, 5, 6, 7, 8, 9];
  
  const getDifficultyLabel = (length: number): string => {
    if (length <= 4) return 'Ușor';
    if (length <= 6) return 'Mediu';
    return 'Greu';
  };

  const getDifficultyColor = (length: number): string => {
    if (length <= 4) return 'bg-green-500 dark:bg-green-600';
    if (length <= 6) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-red-500 dark:bg-red-600';
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="py-4 border-b border-gray-300 dark:border-gray-600">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">CUVÂNTLE</h1>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Bun venit la Cuvântle!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Ghicește cuvintele românești! Alege lungimea cuvântului cu care vrei să începi.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {wordLengths.map((length) => (
              <button
                key={length}
                onClick={() => onWordLengthSelect(length)}
                className="relative p-6 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 group"
              >
                <div className="text-2xl font-bold mb-2">{length} litere</div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(length)}`}>
                  {getDifficultyLabel(length)}
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {length <= 4 ? 'Perfect pentru început' : 
                   length <= 6 ? 'Provocare moderată' : 
                   'Pentru experți'}
                </div>
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              <strong>Cum se joacă:</strong> Ai 6 încercări să ghicești cuvântul.
            </p>
            <p className="mb-2">
              <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span>
              Litera corectă în poziția corectă
            </p>
            <p className="mb-2">
              <span className="inline-block w-4 h-4 bg-yellow-500 rounded mr-2"></span>
              Litera corectă în poziția greșită
            </p>
            <p>
              <span className="inline-block w-4 h-4 bg-gray-400 rounded mr-2"></span>
              Litera nu există în cuvânt
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
