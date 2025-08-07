import { GameSettings } from '../types/game';

const SETTINGS_STORAGE_KEY = 'cuvantle-settings';

const DEFAULT_SETTINGS: GameSettings = {
  wordLength: 5,
  isDarkMode: false,
  isHardMode: false
};

export const getStoredSettings = (): GameSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to parse stored settings:', error);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
};
