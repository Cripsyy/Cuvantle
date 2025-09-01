import React, { useState } from 'react';
import EndGameButtons from './EndGameButtons';
import ChartNavigation, { ChartOption } from './ChartNavigation';
import { GameStats, GameState, GameSettings, ProgressiveMode } from '../types/game';
import { getWinPercentage, getAverageGuesses, getGamesPlayedByLength } from '../utils/stats';
import { GameAnalysis } from '../utils/analysis';
import { useClickOutside } from '../utils/useClickOutside';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  gameState: GameState;
  settings: GameSettings;
  gameAnalysis?: GameAnalysis;
  startNewGame: (wordLength: number) => void;
  handleAnalysisClick?: () => void;
  isProgressiveMode?: boolean;
  progressiveMode?: ProgressiveMode;
  onProgressToNextLevel?: () => void;
  onResetProgressiveMode?: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ 
  isOpen, 
  onClose, 
  stats, 
  gameState, 
  settings, 
  gameAnalysis, 
  startNewGame, 
  handleAnalysisClick,
  isProgressiveMode = false,
  progressiveMode,
  onProgressToNextLevel,
  onResetProgressiveMode
}) => {
  const [currentChart, setCurrentChart] = useState<'distribution' | 'wordLength'>('distribution');
  const { elementRef: modalRef, handleBackdropClick } = useClickOutside(onClose);

  const chartOptions: ChartOption<'distribution' | 'wordLength'>[] = [
    { id: 'distribution', title: 'Distribuția ghicirilor' },
    { id: 'wordLength', title: 'Jocuri după lungime' }
  ];

  const winPercentage = getWinPercentage(stats);
  const averageGuesses = getAverageGuesses(stats);
  const gamesPlayedByLength = getGamesPlayedByLength(stats);

  if (!isOpen) return null;

  // Create array with all word lengths 3-9, filling in zeros for missing lengths
  const allWordLengths = [3, 4, 5, 6, 7, 8, 9].map(length => {
    const found = gamesPlayedByLength.find(item => item.wordLength === length);
    return {
      wordLength: length,
      gamesPlayed: found ? found.gamesPlayed : 0
    };
  });

  // Calculate the maximum value for the bar charts
  const maxDistribution = Math.max(...stats.guessDistribution);
  const maxGamesForLength = Math.max(...allWordLengths.map(item => item.gamesPlayed), 1);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 md:items-center"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-lg w-full max-w-lg animate-slide-up md:animate-none md:mx-4 max-h-[85vh] overflow-y-auto"
      >
        <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">STATISTICI</h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.gamesPlayed}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Jocuri</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{winPercentage}%</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Victorii</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.currentStreak}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Victorii consecutive</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.maxStreak}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Victorii consecutive maxime</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{averageGuesses}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Media încercărilor</div>
          </div>
        </div>

        {/* Chart Display */}
        <div className="p-3 sm:p-4 mb-2 border border-gray-200 rounded-lg dark:border-gray-600 h-64 sm:h-72 bg-gray-50 dark:bg-gray-700">
          {currentChart === 'distribution' ? (
            <div className="flex flex-col h-full">
              <h3 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-center text-gray-900 dark:text-gray-100">DISTRIBUȚIA GHICIRILOR</h3>
              <div className="flex flex-col justify-center flex-1 max-w-full px-1 sm:px-2">
                <div className="flex flex-col gap-2 sm:gap-3">
                  {stats.guessDistribution.map((count, index) => (
                    <div key={index} className="flex flex-row items-center w-full gap-1 sm:gap-2">
                      <div className="w-4 sm:w-6 text-xs sm:text-sm font-medium text-right text-gray-900 dark:text-gray-100">{index + 1}</div>
                      <div
                        className="bg-green-600 dark:bg-green-500 rounded transition-all duration-300 min-w-[4px] h-5 sm:h-6"
                        style={{
                          width: maxDistribution > 0 ? `${Math.max((count / maxDistribution) * 80, count > 0 ? 8 : 2)}%` : '8px'
                        }}
                      ></div>
                      <div className="ml-1 sm:ml-2 text-xs font-medium text-gray-900 dark:text-gray-100">
                        {count > 0 ? count : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <h3 className="mb-3 sm:mb-4 text-sm sm:text-lg font-semibold text-center text-gray-900 dark:text-gray-100">JOCURI DUPĂ LUNGIME</h3>
              <div className="flex flex-col justify-center flex-1 max-w-full px-1 sm:px-2">
                <div className="flex flex-col gap-2">
                  {allWordLengths.map(({ wordLength, gamesPlayed }) => (
                    <div key={wordLength} className="flex flex-row items-center w-full gap-1 sm:gap-2">
                      <div className="w-4 sm:w-6 text-xs sm:text-sm font-medium text-right text-gray-900 dark:text-gray-100">{wordLength}</div>
                      <div
                        className="bg-green-600 dark:bg-green-500 rounded transition-all duration-300 min-w-[4px] h-5 sm:h-6"
                        style={{
                          width: maxGamesForLength > 0 ? `${Math.max((gamesPlayed / maxGamesForLength) * 80, gamesPlayed > 0 ? 8 : 2)}%` : '8px'
                        }}
                      ></div>
                      <div className="ml-1 sm:ml-2 text-xs font-medium text-gray-900 dark:text-gray-100">
                        {gamesPlayed > 0 ? gamesPlayed : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Navigation */}
        <ChartNavigation
          chartOptions={chartOptions}
          currentChart={currentChart}
          onChartChange={setCurrentChart}
          className="mt-6"
        />
        
        <EndGameButtons 
          showStatsModal={isOpen}
          isProgressiveMode={isProgressiveMode}
          gameState={gameState}
          settings={settings}
          gameAnalysis={gameAnalysis}
          progressiveMode={progressiveMode}
          handleAnalysisClick={handleAnalysisClick}
          startNewGame={startNewGame}          
          resetProgressiveMode={onResetProgressiveMode || (() => {})}
          onProgressToNextLevel={onProgressToNextLevel}
          context="modal"
        />
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
