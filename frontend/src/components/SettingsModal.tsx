import React from 'react';
import { GameSettings } from '../types/game';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onWordLengthChange?: (newLength: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange,
  onWordLengthChange
}) => {
  if (!isOpen) return null;

  const wordLengths = [3, 4, 5, 6, 7, 8, 9];

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
            className="p-1 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">Temă</h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
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
        </div>

        {/* Word Length */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">Lungimea cuvântului</h3>
          <div className="grid grid-cols-2 gap-2">
            {wordLengths.map((length) => (
              <button
                key={length}
                onClick={() => handleWordLengthChange(length)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  length === settings.wordLength
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-semibold">{length} litere</div>
                <div className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(length)}`}>
                  {getDifficultyLabel(length)}
                </div>
              </button>
            ))}
          </div>
          {settings.wordLength !== 5 && (
            <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ Schimbarea lungimii va începe un joc nou
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
