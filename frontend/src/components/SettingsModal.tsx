import React, { useState } from 'react';
import { GameSettings } from '../types/game';
import { resetStats } from '../utils/stats';
import { getStoredProgressiveMode } from '../utils/progressiveMode';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onWordLengthChange?: (newLength: number) => void;
  onStatsReset?: () => void;
  onProgressiveModeStart?: () => void;
  resetProgressiveMode?: () => void;
  isProgressiveMode?: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange,
  onWordLengthChange,
  onStatsReset,
  onProgressiveModeStart,
  resetProgressiveMode,
  isProgressiveMode = false
}) => {
  const wordLengths = [3, 4, 5, 6, 7, 8, 9];
  const [progressiveMode, setProgressiveMode] = useState(() => getStoredProgressiveMode());

  if (!isOpen) return null;

  const handleWordLengthChange = (newLength: number) => {
    if (newLength !== settings.wordLength) {
      if (onWordLengthChange) {
        onWordLengthChange(newLength); // Use the specialized handler
      } else {
        onSettingsChange({ ...settings, wordLength: newLength });
      }
    }
  };

  const handleDarkModeToggle = () => {
    onSettingsChange({ ...settings, isDarkMode: !settings.isDarkMode });
  };

  const handleHardModeToggle = () => {
    onSettingsChange({ ...settings, isHardMode: !settings.isHardMode });
  };

  const handleResetStats = () => {
    if (window.confirm('Ești sigur că vrei să resetezi toate statisticile? Această acțiune nu poate fi anulată.')) {
      resetStats();
      if (onStatsReset) {
        onStatsReset();
      }
    }
  };

  const handleProgressiveModeStart = () => {
    const newMode = {
      ...progressiveMode,
      isActive: true,
      currentLevel: 3
    };
    setProgressiveMode(newMode);
    if (onProgressiveModeStart) {
      onProgressiveModeStart();
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Setări</h2>
          <button
            onClick={onClose}
            className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>


        <div className="p-3 mb-6 rounded-lg bg-gray-50 dark:bg-gray-700">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <span>{settings.isDarkMode ? 'Mod întunecat' : 'Mod luminos'}</span>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <hr className="my-4 border-gray-400 border-t-1 dark:border-gray-500" />

          {/* Hard Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <span>Mod greu</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toate indiciile revelate trebuie folosite
                </p>
              </div>
            </div>
            <button
              onClick={handleHardModeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.isHardMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.isHardMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <hr className="my-4 border-gray-400 border-t-1 dark:border-gray-500" />

          {/* Reset Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <span>Resetează statisticile</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Șterge toate statisticile salvate
                </p>
              </div>
            </div>
            <button
              onClick={handleResetStats}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Resetează
            </button>
          </div>
        </div>

        {/* Word Length */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">Lungimea cuvântului</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Word length buttons */}
            {wordLengths.map((length) => (
              <button
                key={length}
                onClick={() => handleWordLengthChange(length)}
                disabled={isProgressiveMode}
                className={`p-3 rounded-lg border-2 transition-all ${
                  !progressiveMode.isActive && length === settings.wordLength
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } ${isProgressiveMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-semibold">{length} litere</div>
                <div className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(length)}`}>
                  {getDifficultyLabel(length)}
                </div>
              </button>
            ))}
            {/* Start progressive mode button */}
            {onProgressiveModeStart && !isProgressiveMode && (
              <button
                onClick={handleProgressiveModeStart}
                className={`p-3 rounded-lg border-2 transition-all border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700`}
              >
                <div className="font-semibold">Mod progresiv</div>
                <div className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-semibold text-white bg-red-800 dark:bg-red-900`}>
                  Foarte Greu
                </div>
              </button>
            )}
            {/* Back to normal mode button */}
            {isProgressiveMode && (
              <button
                onClick={resetProgressiveMode}
                className={`p-3 rounded-lg border-2 transition-all border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500`}
              >
                <div className='flex items-center'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className='font-semibold'>Resetează modul progresiv</span>
                </div>
              </button>
            )}
          </div>

          {!isProgressiveMode ? (
            <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ Schimbarea lungimii va începe un joc nou
            </p>
          ) : (
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              ℹ️ Ești în modul progresiv. Nu poți schimba lungimea cuvântului.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
