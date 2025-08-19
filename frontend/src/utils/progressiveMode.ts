import { ProgressiveMode, GameState } from '../types/game';

const PROGRESSIVE_MODE_KEY = 'cuvantle-progressive-mode';

const DEFAULT_PROGRESSIVE_MODE: ProgressiveMode = {
  isActive: false,
  currentLevel: 3,
  maxLevelReached: 3,
  savedGameState: undefined
};

export const getStoredProgressiveMode = (): ProgressiveMode => {
  try {
    const stored = localStorage.getItem(PROGRESSIVE_MODE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PROGRESSIVE_MODE, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to parse stored progressive mode:', error);
  }
  return DEFAULT_PROGRESSIVE_MODE;
};

export const saveProgressiveMode = (progressiveMode: ProgressiveMode): void => {
  try {
    localStorage.setItem(PROGRESSIVE_MODE_KEY, JSON.stringify(progressiveMode));
  } catch (error) {
    console.warn('Failed to save progressive mode:', error);
  }
};

export const startProgressiveMode = (): ProgressiveMode => {
  const storedState = getStoredProgressiveMode();
  const progressiveModeState = {
    ...storedState,
    isActive: true,
    currentLevel: 3,
    savedGameState: undefined // Clear any saved game state when starting fresh
  };
  saveProgressiveMode(progressiveModeState);
  return progressiveModeState;
};

export const progressToNextLevel = (currentMode: ProgressiveMode): ProgressiveMode => {
  const nextLevel = Math.min(currentMode.currentLevel + 1, 9);
  const newMode = {
    ...currentMode,
    currentLevel: nextLevel,
    maxLevelReached: Math.max(currentMode.maxLevelReached, nextLevel),
    savedGameState: undefined // Clear saved game state when moving to next level
  };
  saveProgressiveMode(newMode);
  return newMode;
};

export const resetProgressiveMode = (currentMode: ProgressiveMode): ProgressiveMode => {
  const newMode = {
    ...currentMode,
    currentLevel: 3,
    savedGameState: undefined,
    isActive: true // Keep it active, just reset to level 3
  };
  saveProgressiveMode(newMode);
  return newMode;
};

export const exitProgressiveMode = (currentMode: ProgressiveMode): ProgressiveMode => {
  const newMode = {
    ...currentMode,
    isActive: false,
    currentLevel: 3,
    savedGameState: undefined
  };
  saveProgressiveMode(newMode);
  return newMode;
};

export const isProgressiveModeComplete = (progressiveMode: ProgressiveMode): boolean => {
  return progressiveMode.currentLevel >= 9;
};

export const saveProgressiveGameState = (currentMode: ProgressiveMode, gameState: GameState): ProgressiveMode => {
  const newMode = {
    ...currentMode,
    savedGameState: gameState
  };
  console.log('Saving progressive game state:', newMode);
  saveProgressiveMode(newMode);
  return newMode;
};

export const hasSavedGameState = (progressiveMode: ProgressiveMode): boolean => {
  return progressiveMode.savedGameState !== undefined;
};
