import { GameStats } from '../types/game';
import { getStoredProgressiveMode } from './progressiveMode';

const STATS_KEY = 'cuvantle-stats';

export const getStoredStats = (): GameStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      const parsedStats = JSON.parse(stored);
      // Migration: ensure gamesPlayedByLength exists (for backwards compatibility)
      if (!parsedStats.gamesPlayedByLength) {
        parsedStats.gamesPlayedByLength = {};
      }
      // Migration: ensure wonNormalMode and wonProgressiveMode exist
      if (parsedStats.wonNormalMode === undefined) {
        parsedStats.wonNormalMode = false;
      }
      if (parsedStats.wonProgressiveMode === undefined) {
        parsedStats.wonProgressiveMode = false;
      }
      
      // One-time migration: If user has reached level 5+ but wonProgressiveMode is still false, fix it
      if (!parsedStats.wonProgressiveMode) {
        const progressiveMode = getStoredProgressiveMode();
        if (progressiveMode.maxLevelReached > 4) {
          parsedStats.wonProgressiveMode = true;
          // Save the updated stats back to localStorage
          localStorage.setItem(STATS_KEY, JSON.stringify(parsedStats));
        }
      }
      
      return parsedStats;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
  
  // Return default stats
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0], // Index 0 = 1 guess, Index 5 = 6 guesses
    gamesPlayedByLength: {}, 
    wonNormalMode: false,
    wonProgressiveMode: false
  };
};

export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

export const updateStats = (currentStats: GameStats, gameWon: boolean, guessCount: number, wordLength: number, isProgressiveMode: boolean = false): GameStats => {

  const progressiveMode = getStoredProgressiveMode();
  const maxLevelReached = progressiveMode.maxLevelReached;

  const newStats = {
    ...currentStats,
    gamesPlayed: currentStats.gamesPlayed + 1,
    gamesWon: gameWon ? currentStats.gamesWon + 1 : currentStats.gamesWon,
    currentStreak: gameWon ? currentStats.currentStreak + 1 : 0,
    maxStreak: gameWon 
      ? Math.max(currentStats.maxStreak, currentStats.currentStreak + 1)
      : currentStats.maxStreak,
    guessDistribution: [...currentStats.guessDistribution],
    gamesPlayedByLength: { ...(currentStats.gamesPlayedByLength || {}) },
    wonNormalMode: currentStats.wonNormalMode || (gameWon && !isProgressiveMode),
    wonProgressiveMode: currentStats.wonProgressiveMode || (maxLevelReached > 4 && isProgressiveMode)
  };

  // Update guess distribution if the game was won
  if (gameWon && guessCount >= 1 && guessCount <= 6) {
    newStats.guessDistribution[guessCount - 1]++;
  }

  // Update games played by word length
  newStats.gamesPlayedByLength[wordLength] = (newStats.gamesPlayedByLength[wordLength] || 0) + 1;

  return newStats;
};

export const getWinPercentage = (stats: GameStats): number => {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
};

export const getAverageGuesses = (stats: GameStats): number => {
  if (stats.gamesWon === 0) return 0;
  
  let totalGuesses = 0;
  let totalWins = 0;
  
  for (let i = 0; i < stats.guessDistribution.length; i++) {
    const guessesForThisRow = stats.guessDistribution[i];
    totalGuesses += guessesForThisRow * (i + 1);
    totalWins += guessesForThisRow;
  }
  
  return totalWins > 0 ? Math.round((totalGuesses / totalWins) * 10) / 10 : 0;
};

export const getGamesPlayedByLength = (stats: GameStats): Array<{ wordLength: number; gamesPlayed: number }> => {
  const gamesPlayedByLength = stats.gamesPlayedByLength || {};
  return Object.entries(gamesPlayedByLength)
    .map(([length, count]) => ({
      wordLength: parseInt(length),
      gamesPlayed: count
    }))
    .sort((a, b) => a.wordLength - b.wordLength); // Sort by word length ascending
};

export const resetStats = (): GameStats => {
  // Clear existing stats
  const resetStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    gamesPlayedByLength: {},
    wonNormalMode: false,
    wonProgressiveMode: false
  };
  saveStats(resetStats);
  return resetStats;
};

export const shouldShowHelpModal = (stats: GameStats, isProgressiveMode: boolean): boolean => {
  if (isProgressiveMode) {
    // For progressive mode, check both wonProgressiveMode and maxLevelReached
    // If user has reached level 5+, they've "won" progressive mode
    const progressiveMode = getStoredProgressiveMode();
    const hasCompletedProgressive = stats.wonProgressiveMode || progressiveMode.maxLevelReached > 4;
    return !hasCompletedProgressive;
  } else {
    return !stats.wonNormalMode;
  }
};
