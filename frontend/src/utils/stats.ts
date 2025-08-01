import { GameStats } from '../types/game';

const STATS_KEY = 'cuvantle-stats';

export const getStoredStats = (): GameStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      const parsedStats = JSON.parse(stored);
      // Ensure backward compatibility by adding missing fields
      return {
        gamesPlayed: parsedStats.gamesPlayed || 0,
        gamesWon: parsedStats.gamesWon || 0,
        currentStreak: parsedStats.currentStreak || 0,
        maxStreak: parsedStats.maxStreak || 0,
        guessDistribution: parsedStats.guessDistribution || [0, 0, 0, 0, 0, 0],
        gamesPlayedByLength: parsedStats.gamesPlayedByLength || {}
      };
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
    gamesPlayedByLength: {} // wordLength -> number of games played
  };
};

export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

export const updateStats = (currentStats: GameStats, gameWon: boolean, guessCount: number, wordLength: number): GameStats => {
  const newStats = {
    ...currentStats,
    gamesPlayed: currentStats.gamesPlayed + 1,
    gamesWon: gameWon ? currentStats.gamesWon + 1 : currentStats.gamesWon,
    currentStreak: gameWon ? currentStats.currentStreak + 1 : 0,
    maxStreak: gameWon 
      ? Math.max(currentStats.maxStreak, currentStats.currentStreak + 1)
      : currentStats.maxStreak,
    guessDistribution: [...currentStats.guessDistribution],
    gamesPlayedByLength: { ...currentStats.gamesPlayedByLength }
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

export const getGamesPlayedByWordLength = (stats: GameStats): Record<number, number> => {
  // Ensure backward compatibility with old stats that might not have this field
  return stats.gamesPlayedByLength || {};
};

export const getFormattedGamesPlayedByLength = (stats: GameStats): Array<{ wordLength: number; gamesPlayed: number }> => {
  const gamesPlayedByLength = getGamesPlayedByWordLength(stats);
  return Object.entries(gamesPlayedByLength)
    .map(([length, count]) => ({
      wordLength: parseInt(length),
      gamesPlayed: count
    }))
    .sort((a, b) => a.wordLength - b.wordLength); // Sort by word length ascending
};
