import React from 'react';
import { GameState, GameSettings, ProgressiveMode } from '../types/game';
import { GameAnalysis } from '../utils/analysis';

interface EndGameButtonsProps {
  showStatsModal: boolean;
  isProgressiveMode: boolean;
  gameState: GameState;
  settings: GameSettings;
  gameAnalysis?: GameAnalysis | null;
  progressiveMode?: ProgressiveMode | null;
  handleAnalysisClick?: () => void;
  startNewGame: (wordLength: number) => void;
  resetProgressiveMode: () => void;
  onProgressToNextLevel?: () => void;
  context?: 'game' | 'modal'; // Add context to distinguish where it's being used
}

const EndGameButtons: React.FC<EndGameButtonsProps> = ({
  showStatsModal,
  isProgressiveMode,
  gameState,
  settings,
  gameAnalysis,
  progressiveMode,
  handleAnalysisClick,
  startNewGame,
  resetProgressiveMode,
  onProgressToNextLevel,
  context = 'game'
}) => {
    // Only render when game is finished
    const gameFinished = gameState.gameStatus === 'won' || gameState.gameStatus === 'lost';
    if (!gameFinished) return null;

    // For game context: only render when stats modal is closed
    if (context === 'game' && showStatsModal) return null;
    
    // For modal context: only render when stats modal is open
    if (context === 'modal' && !showStatsModal) return null;

    return (
      <>
        {context === 'game' ? (
          <div className="flex flex-col p-6 space-y-3 rounded-lg bg-gray-100 dark:bg-gray-700 min-w-[70vw] md:min-w-[30vw]">
            {/* Progress to Next Level Button - only show if game was won and not at max level */}
            {isProgressiveMode && progressiveMode && progressiveMode.currentLevel < 9 && gameState.gameStatus === 'won' && (
              <button
                onClick={onProgressToNextLevel}
                className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Treci la următorul nivel ({progressiveMode.currentLevel + 1} litere)
                </div>
              </button>
            )}
            {/* Reset Progressive Mode Button */}
            {isProgressiveMode && progressiveMode && resetProgressiveMode && (
              <button
                onClick={resetProgressiveMode}
                className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resetează modul progresiv
                </div>
              </button>
            )}
            {/* New Game Button In Regular Mode*/}
            {!isProgressiveMode && (
              <button
                onClick={() => startNewGame(settings.wordLength)}
              className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Joc Nou
            </button>
            )}
            {/* CuvantleBot Button */}
            <button
              onClick={gameAnalysis && handleAnalysisClick ? handleAnalysisClick : undefined}
              disabled={!gameAnalysis}
              className={`px-6 py-3 font-semibold text-white transition-colors rounded-lg ${
                gameAnalysis 
                  ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer' 
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {gameAnalysis ? 'CuvântleBot' : 'Se analizează...'}
              </div>
            </button>
          </div>
        ) : (
          /* Modal context - different styling */
          <div className="flex flex-col mt-4 space-y-3">
            {/* Progress to Next Level Button - only show if game was won and not at max level */}
            {isProgressiveMode && progressiveMode && progressiveMode.currentLevel < 9 && gameState.gameStatus === 'won' && (
              <button
                onClick={onProgressToNextLevel}
                className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Treci la următorul nivel ({progressiveMode.currentLevel + 1} litere)
                </div>
              </button>
            )}
            {/* Reset Progressive Mode Button */}
            {isProgressiveMode && progressiveMode && resetProgressiveMode && (
              <button
                onClick={resetProgressiveMode}
                className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resetează modul progresiv
                </div>
              </button>
            )}
            {/* New Game Button In Regular Mode*/}
            {!isProgressiveMode && (
              <button
                onClick={() => startNewGame(settings.wordLength)}
              className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Joc Nou
            </button>
            )}
            {/* CuvantleBot Button */}
            <button
              onClick={gameAnalysis && handleAnalysisClick ? handleAnalysisClick : undefined}
              disabled={!gameAnalysis}
              className={`px-6 py-3 font-semibold text-white transition-colors rounded-lg ${
                gameAnalysis 
                  ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer' 
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {gameAnalysis ? 'CuvântleBot' : 'Se analizează...'}
              </div>
            </button>
          </div>
        )}
      </>
  );
};

export default EndGameButtons;