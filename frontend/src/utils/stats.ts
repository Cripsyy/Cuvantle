import { GameStats } from '../types/game';

const STATS_KEY = 'cuvantle-stats';

export const getStoredStats = (): GameStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
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
    guessDistribution: [0, 0, 0, 0, 0, 0] // Index 0 = 1 guess, Index 5 = 6 guesses
  };
};

export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

export const updateStats = (currentStats: GameStats, gameWon: boolean, guessCount: number): GameStats => {
  const newStats = {
    ...currentStats,
    gamesPlayed: currentStats.gamesPlayed + 1,
    gamesWon: gameWon ? currentStats.gamesWon + 1 : currentStats.gamesWon,
    currentStreak: gameWon ? currentStats.currentStreak + 1 : 0,
    maxStreak: gameWon 
      ? Math.max(currentStats.maxStreak, currentStats.currentStreak + 1)
      : currentStats.maxStreak,
    guessDistribution: [...currentStats.guessDistribution]
  };

  // Update guess distribution if the game was won
  if (gameWon && guessCount >= 1 && guessCount <= 6) {
    newStats.guessDistribution[guessCount - 1]++;
  }

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
