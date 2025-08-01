import { LetterState, Tile } from '../types/game';

export const checkGuess = (guess: string, targetWord: string): LetterState[] => {
  console.log('Checking guess:', guess, 'against target:', targetWord); // Debug log
  
  const wordLength = targetWord.length;
  const result: LetterState[] = new Array(wordLength).fill('absent');
  const targetLetters = targetWord.split('');
  const guessLetters = guess.split('');
  
  // First pass: mark correct letters
  for (let i = 0; i < wordLength; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      targetLetters[i] = ''; // Mark as used
      guessLetters[i] = ''; // Mark as processed
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < wordLength; i++) {
    if (guessLetters[i] && targetLetters.includes(guessLetters[i])) {
      result[i] = 'present';
      const targetIndex = targetLetters.indexOf(guessLetters[i]);
      targetLetters[targetIndex] = ''; // Mark as used
    }
  }
  
  console.log('Guess result:', result); // Debug log
  return result;
};

export const updateKeyboardLetters = (
  currentKeyboard: Record<string, LetterState>,
  guess: string,
  states: LetterState[]
): Record<string, LetterState> => {
  const newKeyboard = { ...currentKeyboard };
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const state = states[i];
    
    // Only update if the new state is "better" than the current state
    // Priority: correct > present > absent
    if (!newKeyboard[letter] || 
        (state === 'correct') ||
        (state === 'present' && newKeyboard[letter] === 'absent')) {
      newKeyboard[letter] = state;
    }
  }
  
  return newKeyboard;
};

export const normalizeRomanianText = (text: string): string => {
  // Convert to lowercase and handle Romanian characters
  return text
    .toLowerCase()
    .replace(/ă/g, 'ă')
    .replace(/î/g, 'î')
    .replace(/â/g, 'â')
    .replace(/ș/g, 'ș')
    .replace(/ț/g, 'ț');
};

export const isGameWon = (board: Tile[][], currentRow: number): boolean => {
  if (currentRow === 0) return false;
  
  const lastGuess = board[currentRow - 1];
  return lastGuess.every(tile => tile.state === 'correct');
};

export const isGameLost = (currentRow: number, maxRows: number): boolean => {
  return currentRow >= maxRows;
};
