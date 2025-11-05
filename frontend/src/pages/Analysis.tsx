import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameAnalysis } from '../utils/analysis';
import AnalysisModal from '../components/AnalysisModal';

interface AnalysisState {
  analysis: GameAnalysis;
  guesses: string[];
  targetWord: string;
  gameWon: boolean;
  isProgressive?: boolean;
}

const Analysis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as AnalysisState;

  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Redirect to home if no state is provided
  if (!state) {
    navigate('/');
    return null;
  }

  const { analysis, guesses, targetWord, gameWon, isProgressive } = state;
  
  // Track current guess being displayed (0-indexed, -1 means no guesses shown yet)
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);
  
  // Calculate cumulative scores up to current guess
  const cumulativeScores = useMemo(() => {
    if (currentGuessIndex < 0) {
      return { luck: 0, skill: 0, avgInformation: 0 };
    }
    
    const relevantMetrics = analysis.guessMetrics.slice(0, currentGuessIndex + 1);
    const totalLuck = relevantMetrics.reduce((sum, m) => sum + m.luck, 0);
    const totalSkill = relevantMetrics.reduce((sum, m) => sum + m.skill, 0);
    const totalInfo = relevantMetrics.reduce((sum, m) => sum + m.informationValue, 0);
    
    const count = relevantMetrics.length;
    
    // Metrics are already normalized to 0-100, just calculate averages
    const averageLuck = Math.round(totalLuck / count);
    const averageSkill = Math.round(totalSkill / count);
    
    return {
      luck: averageLuck,
      skill: averageSkill,
      avgInformation: totalInfo / count
    };
  }, [currentGuessIndex, analysis.guessMetrics]);
  
  const handleNext = () => {
    if (currentGuessIndex < guesses.length - 1) {
      setCurrentGuessIndex(currentGuessIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentGuessIndex > 0) {
      setCurrentGuessIndex(currentGuessIndex - 1);
    }
  };
  
  const handleReset = () => {
    setCurrentGuessIndex(0);
  };
  
  const handleShowAll = () => {
    setCurrentGuessIndex(guesses.length - 1);
  };

  // Helper function to render a tile
  const renderTile = (letter: string, state: string) => {
    const stateColors = {
      correct: 'bg-green-600 border-green-600 text-white',
      present: 'bg-yellow-500 border-yellow-500 text-white',
      absent: 'bg-gray-400 border-gray-400 text-white dark:bg-gray-600 dark:border-gray-600',
      empty: 'bg-gray-500 border-gray-500 dark:bg-gray-900 dark:border-gray-900'
    };
    
    return (
      <div className={`w-12 h-12 md:w-14 md:h-14 border-2 flex items-center justify-center text-xl md:text-2xl font-bold rounded ${stateColors[state as keyof typeof stateColors] || stateColors.empty}`}>
        {letter.toUpperCase()}
      </div>
    );
  };

  const handleAnalysisHelpClick = () => {
    setShowAnalysisModal(true);
  };

  return (
    <div className="min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold">CuvântleBot</h1>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* Game Result */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">
              {gameWon ? "Ai câștigat!" : "Ai pierdut"}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Cuvântul era:&nbsp;
              <a
                className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline"
                href={`https://www.dexonline.ro/definitie/${encodeURIComponent(targetWord)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span title = "Apasă pentru a vedea definiția cuvântului">
                  {targetWord.toUpperCase()}
                </span>
              </a>
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left side - Grid and Controls */}
          <div className="flex flex-col space-y-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            {/* Grid Display */}
            <div className="p-6">
              <h3 className="flex justify-center mb-8 text-xl font-semibold">Progresul încercărilor</h3>
              <div className="flex flex-col items-center space-y-3">
                {Array.from({ length: 6 }).map((_, rowIdx) => {
                  const guess = guesses[rowIdx];
                  const wordLength = targetWord.length;
                  
                  // If this row has no guess, show empty tiles
                  if (!guess) {
                    return (
                      <div key={rowIdx} className="flex gap-2">
                        {Array.from({ length: wordLength }).map((_, letterIdx) => (
                          <div key={letterIdx}>
                            {renderTile('', 'empty')}
                          </div>
                        ))}
                      </div>
                    );
                  }
                  
                  // Determine if this row's letters should be shown
                  // First guess always shows letters
                  // Other guesses show letters only when user reaches that index
                  const isFirstGuess = rowIdx === 0;
                  const hasReachedThisGuess = rowIdx <= currentGuessIndex;
                  const shouldShowLetters = isFirstGuess || hasReachedThisGuess;
                  
                  return (
                    <div 
                      key={rowIdx}
                      className="flex gap-2"
                    >
                      {guess.split('').map((letter, letterIdx) => {
                        const state = analysis.guessMetrics[rowIdx].feedback[letterIdx];
                        const displayLetter = shouldShowLetters ? letter : '';
                        
                        return (
                          <div key={letterIdx}>
                            {renderTile(displayLetter, state)}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Încercarea {currentGuessIndex + 1} din {guesses.length}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {analysis.guessMetrics[currentGuessIndex]?.wordsRemaining || 0} cuvinte rămase
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  disabled={currentGuessIndex === 0}
                  className="flex justify-center flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4V20M8 12H20M8 12L12 8M8 12L12 16" />
                  </svg>
                </button>
                <button
                  onClick={handlePrevious}
                  disabled={currentGuessIndex === 0}
                  className="flex justify-center flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12H18M6 12L11 7M6 12L11 17" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentGuessIndex === guesses.length - 1}
                  className="flex justify-center flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12H18M18 12L13 7M18 12L13 17" />
                  </svg>
                </button>
                <button
                  onClick={handleShowAll}
                  disabled={currentGuessIndex === guesses.length - 1}
                  className="flex justify-center flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4V20M4 12H16M16 12L12 8M16 12L12 16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Scores */}
          <div className="flex flex-col p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="relative flex items-center justify-center mb-6 text-gray-700 dark:text-gray-300">
              <h3 className="text-xl font-semibold">Metrici</h3>
              <button 
                onClick={handleAnalysisHelpClick}
                className="absolute right-0 p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Informații despre metrici"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>  
            
            {/* Header Row */}
            <div className="grid grid-cols-4 gap-4 pb-3 mb-3 text-sm font-semibold text-center text-gray-700 border-b-2 border-gray-300 dark:text-gray-300 dark:border-gray-600">
              <div>Noroc</div>
              <div>Abilitate</div>
              <div>Cuvinte rămase</div>
              <div>Informație</div>
            </div>
            
            {/* Data Rows - always render 6 rows but only populate when reached */}
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => {
                const metrics = analysis.guessMetrics[idx];
                const hasReachedThisRow = idx <= currentGuessIndex;
                const shouldPopulate = hasReachedThisRow && metrics;
                
                // Calculate cumulative information up to this guess
                let cumulativeInfo = 0;
                if (shouldPopulate) {
                  for (let i = 0; i <= idx; i++) {
                    cumulativeInfo += analysis.guessMetrics[i].informationValue;
                  }
                }
                
                return (
                  <React.Fragment key={idx}>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="p-2">
                        <div className={`text-lg font-bold ${shouldPopulate ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>
                          {shouldPopulate ? metrics.luck : '-'}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className={`text-lg font-bold ${shouldPopulate ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>
                          {shouldPopulate ? metrics.skill : '-'}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className={`text-lg font-bold ${shouldPopulate ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>
                          {shouldPopulate ? metrics.wordsRemaining : '-'}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className={`text-lg font-bold ${shouldPopulate ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>
                          {shouldPopulate ? `${Math.round(cumulativeInfo)}%` : '-'}
                        </div>
                      </div>
                    </div>
                    {idx < 5 && (
                      <hr className="border-gray-300 dark:border-gray-600" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            {/* Averages Section */}
            <div className="pt-4 mt-4 border-t-2 border-gray-400 dark:border-gray-500">
              <div className="mb-2 text-sm font-semibold text-center text-gray-600 dark:text-gray-400">
                Total
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-gray-200 rounded dark:bg-gray-700">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {cumulativeScores.luck}
                  </div>
                </div>
                <div className="p-3 bg-gray-200 rounded dark:bg-gray-700">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {cumulativeScores.skill}
                  </div>
                </div>
                <div className="p-3 bg-gray-200 rounded dark:bg-gray-700">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {analysis.guessMetrics[currentGuessIndex]?.wordsRemaining}
                  </div>
                </div>
                <div className="p-3 bg-gray-200 rounded dark:bg-gray-700">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {(() => {
                      // Calculate final cumulative information percentage
                      const relevantMetrics = analysis.guessMetrics.slice(0, currentGuessIndex + 1);
                      const finalInfo = relevantMetrics.reduce((sum, m) => sum + m.informationValue, 0);
                      return `${Math.round(finalInfo)}%`;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row sm:gap-8">
          <button
            onClick={() => navigate(isProgressive ? `/game/progressive/` : `/game/`)} 
            className="px-8 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 min-w-40"
          >
            Joacă din nou
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 min-w-40"
          >
            Înapoi acasă
          </button>
        </div>
      </div>

      <AnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
      />
      
    </div>
    
  );
};

export default Analysis;
