import React, { useState } from 'react';
import { GameStats } from '../types/game';
import { getWinPercentage, getAverageGuesses } from '../utils/stats';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  nextGameCountdown?: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, nextGameCountdown }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const winPercentage = getWinPercentage(stats);
  const averageGuesses = getAverageGuesses(stats);

  const generateShareText = (): string => {
    const gameNumber = stats.gamesPlayed;
    const attempts = stats.gamesWon > 0 ? averageGuesses.toString() : 'X';
    
    let shareText = `Cuvântle ${gameNumber} ${attempts}/6\n\n`;
    
    // Add guess distribution visualization
    for (let i = 0; i < stats.guessDistribution.length; i++) {
      const count = stats.guessDistribution[i];
      if (count > 0) {
        shareText += `${i + 1}: ${'🟩'.repeat(Math.min(count, 10))}\n`;
      }
    }
    
    shareText += `\n${winPercentage}% victorii, seria ${stats.currentStreak}`;
    return shareText;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Cuvântle - Statisticile mele',
          text: shareText
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!isOpen) return null;

  // Calculate the maximum value for the bar chart
  const maxDistribution = Math.max(...stats.guessDistribution);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
        <div className="grid grid-cols-4 gap-4 mb-6">
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
            <div className="text-sm text-gray-600 dark:text-gray-400">Seria actuală</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.maxStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cea mai bună</div>
          </div>
        </div>

        {/* Guess Distribution */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">DISTRIBUȚIA GHICIRILOR</h3>
          <div className="space-y-2">
            {stats.guessDistribution.map((count, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {index + 1}
                </div>
                <div className="relative flex-1 h-6 bg-gray-200 rounded-sm dark:bg-gray-700">
                  <div
                    className="flex items-center justify-end h-full pr-1 transition-all duration-300 bg-green-600 rounded-sm dark:bg-green-500"
                    style={{
                      width: maxDistribution > 0 ? `${Math.max((count / maxDistribution) * 100, count > 0 ? 7 : 0)}%` : '0%'
                    }}
                  >
                    {count > 0 && (
                      <span className="text-sm font-medium text-white">{count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        {stats.gamesWon > 0 && (
          <div className="p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="text-center">
              <div className="mb-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                Media încercărilor
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {averageGuesses}
              </div>
            </div>
          </div>
        )}

        {/* Next Game Countdown */}
        {nextGameCountdown !== undefined && (
          <div className="p-4 text-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              URMĂTORUL CUVÂNT ÎN
            </div>
            <div className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(nextGameCountdown)}
            </div>
          </div>
        )}

        {/* Share Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleShare}
            className="px-6 py-2 font-semibold text-white transition-colors bg-green-600 rounded-lg dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600"
          >
            {copied ? 'Copiat!' : 'Partajează'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
