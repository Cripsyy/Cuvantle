import React, { useState } from 'react';
import { GameStats } from '../types/game';
import { getWinPercentage, getAverageGuesses, getGamesPlayedByLength } from '../utils/stats';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats}) => {
  const [currentChart, setCurrentChart] = useState<'distribution' | 'wordLength'>('distribution');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">STATISTICI</h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.gamesPlayed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Jocuri</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{winPercentage}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Victorii</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.currentStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Victorii consecutive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.maxStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Victorii consecutive maxime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{averageGuesses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Media încercărilor</div>
          </div>
        </div>

        {/* Chart Display */}
        <div className="mb-2 h-72">
          {currentChart === 'distribution' ? (
            <div className="flex flex-col h-full">
              <h3 className="mb-4 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">DISTRIBUȚIA GHICIRILOR</h3>
              <div className="flex flex-col justify-center flex-1 max-w-full px-2">
                <div className="flex flex-col gap-3">
                  {stats.guessDistribution.map((count, index) => (
                    <div key={index} className="flex flex-row items-center w-full gap-2">
                      <div className="w-6 text-sm font-medium text-right text-gray-900 dark:text-gray-100">{index + 1}</div>
                      <div
                        className="bg-green-600 dark:bg-green-500 rounded transition-all duration-300 min-w-[4px] h-6"
                        style={{
                          width: maxDistribution > 0 ? `${Math.max((count / maxDistribution) * 80, count > 0 ? 8 : 2)}%` : '8px'
                        }}
                      ></div>
                      <div className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-100">
                        {count > 0 ? count : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <h3 className="mb-4 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">JOCURI DUPĂ LUNGIME</h3>
              <div className="flex flex-col justify-center flex-1 max-w-full px-2">
                <div className="flex flex-col gap-2">
                  {allWordLengths.map(({ wordLength, gamesPlayed }) => (
                    <div key={wordLength} className="flex flex-row items-center w-full gap-2">
                      <div className="w-6 text-sm font-medium text-right text-gray-900 dark:text-gray-100">{wordLength}</div>
                      <div
                        className="bg-green-600 dark:bg-green-500 rounded transition-all duration-300 min-w-[4px] h-6"
                        style={{
                          width: maxGamesForLength > 0 ? `${Math.max((gamesPlayed / maxGamesForLength) * 80, gamesPlayed > 0 ? 8 : 2)}%` : '8px'
                        }}
                      ></div>
                      <div className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-100">
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
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-4">
            {/* Left Arrow */}
            <button
              onClick={() => setCurrentChart(currentChart === 'distribution' ? 'wordLength' : 'distribution')}
              className="p-1 text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title="Graficul anterior"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Bullet Indicators */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentChart('distribution')}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentChart === 'distribution'
                    ? 'bg-gray-800 dark:bg-gray-200 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                title="Distribuția ghicirilor"
              />
              <button
                onClick={() => setCurrentChart('wordLength')}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentChart === 'wordLength'
                    ? 'bg-gray-800 dark:bg-gray-200 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                title="Jocuri după lungime"
              />
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => setCurrentChart(currentChart === 'distribution' ? 'wordLength' : 'distribution')}
              className="p-1 text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title="Graficul următor"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
