export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

export interface Tile {
  letter: string;
  state: LetterState;
}

export interface GameState {
  board: Tile[][];
  currentRow: number;
  currentCol: number;
  gameStatus: 'playing' | 'won' | 'lost';
  targetWord: string;
  guesses: string[];
  keyboardLetters: Record<string, LetterState>;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}
