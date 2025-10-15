import { checkGuess } from './gameLogic';
import { LetterState } from '../types/game';

export interface GuessMetrics {
  guess: string;
  guessNumber: number;
  luck: number;
  skill: number;
  informationValue: number;
  wordsEliminated: number;
  wordsRemaining: number;
  feedback: LetterState[];
}

export interface GameAnalysis {
  luck: number;
  skill: number;
  breakdown: {
    totalGuesses: number;
    optimalGuesses: number;
    luckyGuesses: number;
    averageInformationGained: number;
  };
  guessMetrics: GuessMetrics[];
}

// Filter remaining possible words based on guess feedback
const filterRemainingWords = (
  words: string[], 
  guess: string, 
  feedback: LetterState[]
): string[] => {
  return words.filter(word => {
    // Check if this word is consistent with the feedback
    for (let i = 0; i < guess.length; i++) {
      const guessLetter = guess[i];
      const wordLetter = word[i];
      const state = feedback[i];
      
      if (state === 'correct') {
        // Letter must be in the correct position
        if (wordLetter !== guessLetter) {
          return false;
        }
      } else if (state === 'present') {
        // Letter must be in the word but not in this position
        if (wordLetter === guessLetter || !word.includes(guessLetter)) {
          return false;
        }
      } else if (state === 'absent') {
        // Letter must not be in the word (unless it appears elsewhere as correct/present)
        const hasCorrectOccurrence = feedback.some((s, idx) => 
          s === 'correct' && guess[idx] === guessLetter
        );
        const hasPresentOccurrence = feedback.some((s, idx) => 
          s === 'present' && guess[idx] === guessLetter
        );
        
        if (!hasCorrectOccurrence && !hasPresentOccurrence && word.includes(guessLetter)) {
          return false;
        }
      }
    }
    return true;
  });
};

// Calculate how many words would remain after a guess
const calculateWordsRemaining = (
  remainingWords: string[],
  guess: string,
  targetWord: string
): number => {
  if (remainingWords.length === 0) return 0;
  
  const feedback = checkGuess(guess, targetWord);
  const filteredWords = filterRemainingWords(remainingWords, guess, feedback);
  console.log(`After guessing "${guess}", words remaining: ${filteredWords.length}`);
  console.log('Remaining words:', filteredWords);
  return filteredWords.length;
};

// Calculate how much information a guess provides using word elimination
const calculateInformationValue = (
  guess: string, 
  targetWord: string, 
  remainingWords: string[]
): { informationValue: number; wordsEliminated: number; wordsRemaining: number } => {
  if (remainingWords.length === 0) {
    // Fallback to simple scoring if no word list is available
    const guessResult = checkGuess(guess, targetWord);
    const greenCount = guessResult.filter(state => state === 'correct').length;
    const yellowCount = guessResult.filter(state => state === 'present').length;
    const grayCount = guessResult.filter(state => state === 'absent').length;
    return {
      informationValue: greenCount * 2 + yellowCount * 1 + grayCount * 0.5,
      wordsEliminated: 0,
      wordsRemaining: 0
    };
  }

  const initialWordCount = remainingWords.length;
  const wordsRemaining = calculateWordsRemaining(remainingWords, guess, targetWord);
  const wordsEliminated = initialWordCount - wordsRemaining;
  
  // Information value based on how many words were eliminated
  const eliminationRatio = wordsEliminated / Math.max(1, initialWordCount);
  const informationValue = eliminationRatio * 10; // Scale to 0-10 range
  
  return {
    informationValue,
    wordsEliminated,
    wordsRemaining
  };
};

// Calculate how "lucky" a guess was based on unexpected correct positions
const calculateLuckForGuess = (guess: string, targetWord: string, guessNumber: number): number => {
  const guessResult = checkGuess(guess, targetWord);
  let luckScore = 0;
  
  for (let i = 0; i < guess.length; i++) {
    if (guessResult[i] === 'correct') {
      // Getting a green on the first guess is luckier than on later guesses
      const luckMultiplier = Math.max(1, 4 - guessNumber);
      luckScore += luckMultiplier;
    } else if (guessResult[i] === 'present') {
      // Finding a letter in the word (but wrong position) has some luck factor
      luckScore += 0.5;
    }
  }
  
  return luckScore;
};

// Calculate skill based on word elimination effectiveness
const calculateSkillForGuess = (
  guess: string, 
  guessNumber: number, 
  wordLength: number,
  remainingWords: string[],
  targetWord: string
): number => {
  let skillScore = 0;
  
  // If we have word list, base skill on elimination effectiveness
  if (remainingWords.length > 0) {
    const { informationValue, wordsEliminated } = calculateInformationValue(guess, targetWord, remainingWords);
    
    // Base skill on information gained
    skillScore += informationValue;
    
    // Bonus for eliminating many words early in the game
    if (guessNumber <= 2 && wordsEliminated > remainingWords.length * 0.5) {
      skillScore += 2;
    }
    
    return skillScore;
  }
  
  // Fallback logic when no word list is available
  // Common starting words show good strategy
  const goodStartingWords: Record<number, string[]> = {
    5: ['adore', 'carne', 'parte', 'carte', 'verde'],
    6: ['carton', 'portar', 'storce', 'porter'],
    4: ['care', 'mare', 'dare', 'pare'],
    // Add more as needed
  };
  
  if (guessNumber === 1 && goodStartingWords[wordLength]?.includes(guess.toLowerCase())) {
    skillScore += 2;
  }
  
  // Check for good letter distribution (vowels + consonants)
  const vowels = ['a', 'e', 'i', 'o', 'u', 'ă', 'î', 'â'];
  const vowelCount = guess.split('').filter(letter => vowels.includes(letter.toLowerCase())).length;
  const consonantCount = guess.length - vowelCount;
  
  // Good balance of vowels and consonants
  if (vowelCount >= 1 && consonantCount >= 2) {
    skillScore += 1;
  }
  
  // No repeated letters in early guesses shows good strategy
  const uniqueLetters = new Set(guess.toLowerCase().split(''));
  if (guessNumber <= 2 && uniqueLetters.size === guess.length) {
    skillScore += 1;
  }
  
  return skillScore;
};

export const analyzeGame = (
  guesses: string[],
  targetWord: string,
  gameWon: boolean,
  wordLength: number,
  remainingWords?: string[]
): GameAnalysis => {
  let totalLuck = 0;
  let totalSkill = 0;
  let totalInformation = 0;
  
  // Start with all possible words or empty array if not provided
  let currentRemainingWords = remainingWords ? [...remainingWords] : [];
  
  // Store metrics for each guess
  const guessMetrics: GuessMetrics[] = [];
  
  // Analyze each guess
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const guessNumber = i + 1;
    
    // Get feedback for this guess
    const feedback = checkGuess(guess, targetWord);
    
    // Calculate luck for this guess
    const guessLuck = calculateLuckForGuess(guess, targetWord, guessNumber);
    totalLuck += guessLuck;
    
    // Calculate skill for this guess
    const guessSkill = calculateSkillForGuess(guess, guessNumber, wordLength, currentRemainingWords, targetWord);
    totalSkill += guessSkill;
    
    // Calculate information value
    const infoResult = calculateInformationValue(guess, targetWord, currentRemainingWords);
    totalInformation += infoResult.informationValue;
    
    // Store metrics for this guess
    guessMetrics.push({
      guess,
      guessNumber,
      luck: guessLuck,
      skill: guessSkill,
      informationValue: infoResult.informationValue,
      wordsEliminated: infoResult.wordsEliminated,
      wordsRemaining: infoResult.wordsRemaining,
      feedback
    });
    
    // Update remaining words for next iteration
    if (currentRemainingWords.length > 0) {
      currentRemainingWords = filterRemainingWords(currentRemainingWords, guess, feedback);
    }
  }
  
  // Normalize scores to 0-100 scale
  // Base on word elimination efficiency if we have word list
  let normalizedSkill: number;
  let normalizedLuck: number;
  
  if (remainingWords && remainingWords.length > 0) {
    // Calculate based on information theory
    const maxPossibleInformation = Math.log2(remainingWords.length) * guesses.length;
    normalizedSkill = Math.min(100, Math.round((totalSkill / Math.max(1, maxPossibleInformation)) * 100));
    
    // Luck based on unexpected eliminations
    const averageLuck = totalLuck / Math.max(1, guesses.length);
    normalizedLuck = Math.min(100, Math.round(averageLuck * 10));
  } else {
    // Fallback normalization
    const maxPossibleSkill = guesses.length * 5;
    const maxPossibleLuck = guesses.length * wordLength * 2;
    
    normalizedSkill = Math.min(100, Math.round((totalSkill / Math.max(1, maxPossibleSkill)) * 100));
    normalizedLuck = Math.min(100, Math.round((totalLuck / Math.max(1, maxPossibleLuck)) * 100));
  }
  
  // Bonus for winning
  const finalLuck = gameWon ? Math.min(100, normalizedLuck + 10) : normalizedLuck;
  const finalSkill = gameWon ? Math.min(100, normalizedSkill + 10) : normalizedSkill;
  
  return {
    luck: finalLuck,
    skill: finalSkill,
    breakdown: {
      totalGuesses: guesses.length,
      optimalGuesses: Math.max(1, Math.ceil(Math.log2(remainingWords?.length || 100))), // Information theory optimal
      luckyGuesses: Math.round(totalLuck / Math.max(1, wordLength)),
      averageInformationGained: totalInformation / Math.max(1, guesses.length)
    },
    guessMetrics
  };
};
