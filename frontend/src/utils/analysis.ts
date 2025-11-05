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
  return filteredWords.length;
};

// Calculate information as a percentage (0-100) of how much of the word is figured out
// Each position in the word contributes equally to the total (e.g., 20% for a 5-letter word)
// Green letter = 100% of that position, Yellow = 50% of that position, Gray = 15% of that position
const calculateInformationPercentage = (
  guess: string,
  targetWord: string,
  previousGuesses: string[],
  previousFeedback: LetterState[][]
): number => {
  const wordLength = targetWord.length;
  const currentFeedback = checkGuess(guess, targetWord);
  const pointsPerPosition = 100 / wordLength; // e.g., 20 for 5-letter word
  
  // Track the best knowledge we have for each position
  // 0 = no info, 1 = minimal (gray), 2 = partial (yellow), 3 = complete (green)
  const positionState: number[] = new Array(wordLength).fill(0);
  
  // Process all previous guesses
  for (let i = 0; i < previousFeedback.length; i++) {
    const feedback = previousFeedback[i];
    
    for (let j = 0; j < feedback.length; j++) {
      const state = feedback[j];
      
      if (state === 'correct') {
        positionState[j] = 3; // Complete knowledge
      } else if (state === 'present' && positionState[j] < 3) {
        positionState[j] = Math.max(positionState[j], 2); // Partial knowledge
      } else if (state === 'absent' && positionState[j] < 2) {
        positionState[j] = Math.max(positionState[j], 1); // Minimal knowledge
      }
    }
  }
  
  // Process the current guess
  // Note: If we already have green (3) for a position, we maintain that knowledge
  // even if the current guess tries a different letter there
  for (let j = 0; j < currentFeedback.length; j++) {
    const state = currentFeedback[j];
    
    if (state === 'correct') {
      positionState[j] = 3; // Complete knowledge
    } else if (state === 'present' && positionState[j] < 3) {
      positionState[j] = Math.max(positionState[j], 2); // Partial knowledge
    } else if (state === 'absent' && positionState[j] < 3) {
      // Don't downgrade from green to gray
      // If we already knew the position (green), testing a wrong letter doesn't reduce our knowledge
      positionState[j] = Math.max(positionState[j], 1); // Minimal knowledge
    }
  }
  
  // Calculate total information percentage
  // Green (state 3) = 100% of position = full pointsPerPosition
  // Yellow (state 2) = 50% of position = half pointsPerPosition  
  // Gray (state 1) = 15% of position = 15% of pointsPerPosition
  // Nothing (state 0) = 0%
  let totalInfo = 0;
  for (let i = 0; i < wordLength; i++) {
    if (positionState[i] === 3) {
      totalInfo += pointsPerPosition; // Green: full contribution
    } else if (positionState[i] === 2) {
      totalInfo += pointsPerPosition * 0.5; // Yellow: half contribution
    } else if (positionState[i] === 1) {
      totalInfo += pointsPerPosition * 0.15; // Gray: small contribution
    }
  }
  
  return Math.round(totalInfo);
};

// Calculate how much NEW information this specific guess provided
const calculateInformationGained = (
  guess: string,
  targetWord: string,
  previousGuesses: string[],
  previousFeedback: LetterState[][]
): { informationValue: number; wordsEliminated: number; wordsRemaining: number } => {
  const wordLength = targetWord.length;
  const currentFeedback = checkGuess(guess, targetWord);
  
  // Calculate information percentage BEFORE this guess
  const infoBefore = previousGuesses.length > 0 
    ? calculateInformationPercentage(
        previousGuesses[previousGuesses.length - 1],
        targetWord,
        previousGuesses.slice(0, -1),
        previousFeedback.slice(0, -1)
      )
    : 0;
  
  // Calculate information percentage AFTER this guess (including it)
  const infoAfter = calculateInformationPercentage(
    guess,
    targetWord,
    previousGuesses,
    previousFeedback
  );
  
  // The information gained is the difference
  const informationGained = infoAfter - infoBefore;
  
  return {
    informationValue: Math.max(0, informationGained),
    wordsEliminated: 0, // Not used in new approach
    wordsRemaining: 0   // Will be set by caller
  };
};

// Calculate how "lucky" a guess was based on unexpected correct positions
// Returns a value from 0-100
const calculateLuckForGuess = (
  guess: string, 
  targetWord: string, 
  previousGuesses: string[],
  previousFeedback: LetterState[][],
  initialTotalLetters: number = 31 // Total unique letters in Romanian alphabet
): number => {
  const guessResult = checkGuess(guess, targetWord);
  
  // Track which letters were already known from previous guesses
  const knownCorrectPositions = new Set<string>(); // "letter:position"
  const knownPresentLetters = new Set<string>(); // just the letter
  const absentLetters = new Set<string>(); // letters ruled out
  
  // Build knowledge from previous guesses
  for (let i = 0; i < previousFeedback.length; i++) {
    const prevGuess = previousGuesses[i];
    const feedback = previousFeedback[i];
    
    for (let j = 0; j < feedback.length; j++) {
      const letter = prevGuess[j];
      const state = feedback[j];
      
      if (state === 'correct') {
        knownCorrectPositions.add(`${letter}:${j}`);
        knownPresentLetters.add(letter); // If correct, we also know it's present
      } else if (state === 'present') {
        knownPresentLetters.add(letter);
      } else if (state === 'absent') {
        absentLetters.add(letter);
      }
    }
  }
  
  // Calculate effective letter pool (remove absent letters from consideration)
  const remainingLetterPool = initialTotalLetters - absentLetters.size;
  
  let newCorrectLetters = 0;
  let newPresentLetters = 0;
  let upgradedCorrectLetters = 0; // Letters that went from present to correct
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const state = guessResult[i];
    
    if (state === 'correct') {
      // Only count as luck if this POSITION wasn't already known to be correct
      if (!knownCorrectPositions.has(`${letter}:${i}`)) {
        // Check if this letter was already known to be present
        if (knownPresentLetters.has(letter)) {
          // This is an upgrade from present to correct - less lucky
          upgradedCorrectLetters++;
        } else {
          // Completely new correct letter - very lucky
          newCorrectLetters++;
        }
      }
    } else if (state === 'present') {
      // Only count as luck if this letter wasn't already known to be in the word
      if (!knownPresentLetters.has(letter)) {
        newPresentLetters++;
      }
    }
  }
  
  // If no new discoveries, return 0
  if (newCorrectLetters === 0 && newPresentLetters === 0 && upgradedCorrectLetters === 0) {
    return 0;
  }
  
  // Calculate luck with a balanced formula
  // Base points per discovery:
  // - Brand new correct position: 18 points (finding letter + position without prior knowledge)
  // - Upgraded to correct: 8 points (knew letter existed, found its position - less lucky)
  // - New present letter: 10 points (finding a letter that's in the word)
  const baseCorrectPoints = 18;
  const baseUpgradedPoints = 8;
  const basePresentPoints = 10;
  
  const totalNewDiscoveries = newCorrectLetters + newPresentLetters + upgradedCorrectLetters;
  
  // Multiplier increases with more simultaneous discoveries
  // Finding multiple letters at once is luckier, but use moderate scaling
  // 1 discovery: 1.0x, 2: 1.4x, 3: 1.8x, 4: 2.2x, 5: 2.6x
  const discoveryMultiplier = 1 + (totalNewDiscoveries - 1) * 0.4;
  
  // Factor in the shrinking letter pool (later guesses have smaller pool to pick from)
  // Use square root to soften the penalty - we don't want it too harsh
  // Pool factor ranges from 1.0 (no letters ruled out) to ~0.5 (many letters ruled out)
  const poolFactor = Math.sqrt(remainingLetterPool / initialTotalLetters);
  
  let luckScore = (
    newCorrectLetters * baseCorrectPoints + 
    upgradedCorrectLetters * baseUpgradedPoints + 
    newPresentLetters * basePresentPoints
  ) * discoveryMultiplier * poolFactor;
  
  // Cap at 100
  return Math.min(100, Math.round(luckScore));
};

// Calculate skill based on information gained with this guess
// Returns a value from 0-100
const calculateSkillForGuess = (
  informationGained: number,
  guessNumber: number,
  guess: string,
  previousGuesses: string[],
  previousFeedback: LetterState[][],
  targetWord: string
): number => {
  // Base skill on how much information was gained (0-100 scale)
  // Scale it up since information gained can be small but still skillful
  let skillScore = informationGained * 1.5;
  
  // Bonus for strategic choices in early guesses (diverse letters)
  if (guessNumber <= 2) {
    const uniqueLetters = new Set(guess.toLowerCase().split(''));
    if (uniqueLetters.size === guess.length) {
      skillScore += 10; // Bonus for no repeated letters
    }
    
    // Bonus for good vowel/consonant distribution
    const vowels = ['a', 'e', 'i', 'o', 'u', 'ă', 'î', 'â'];
    const vowelCount = guess.split('').filter(letter => vowels.includes(letter.toLowerCase())).length;
    if (vowelCount >= 2 && vowelCount <= 3) {
      skillScore += 5; // Good balance
    }
  }
  
  // Bonus for efficiently reusing known information (yellow letters)
  if (previousGuesses.length > 0) {
    const knownPresentLetters = new Set<string>();
    const knownCorrectPositions = new Set<string>();
    
    // Find letters we knew were present or correct
    for (let i = 0; i < previousFeedback.length; i++) {
      const prevGuess = previousGuesses[i];
      const feedback = previousFeedback[i];
      
      for (let j = 0; j < feedback.length; j++) {
        if (feedback[j] === 'correct') {
          knownCorrectPositions.add(`${prevGuess[j]}:${j}`);
        } else if (feedback[j] === 'present') {
          knownPresentLetters.add(prevGuess[j]);
        }
      }
    }
    
    // Check current guess feedback
    const currentFeedback = checkGuess(guess, targetWord);
    
    // Reward for successfully repositioning yellow letters to green
    let repositionedToGreen = 0;
    for (let i = 0; i < guess.length; i++) {
      if (currentFeedback[i] === 'correct' && 
          knownPresentLetters.has(guess[i]) &&
          !knownCorrectPositions.has(`${guess[i]}:${i}`)) {
        repositionedToGreen++;
      }
    }
    
    if (repositionedToGreen > 0) {
      skillScore += repositionedToGreen * 10; // Significant bonus for turning yellow to green
    }
    
    // Reward for reusing known correct positions
    let reusedCorrect = 0;
    for (let i = 0; i < guess.length; i++) {
      if (knownCorrectPositions.has(`${guess[i]}:${i}`) && currentFeedback[i] === 'correct') {
        reusedCorrect++;
      }
    }
    
    if (reusedCorrect > 0) {
      skillScore += reusedCorrect * 2; // Small bonus for maintaining known correct letters
    }
  }
  
  // Cap at 100
  return Math.min(100, Math.round(skillScore));
};

export const analyzeGame = (
  guesses: string[],
  targetWord: string,
  wordLength: number,
  remainingWords?: string[]
): GameAnalysis => {
  let totalLuck = 0;
  let totalSkill = 0;
  let totalInformation = 0;
  
  // Start with all possible words or empty array if not provided
  let currentRemainingWords = remainingWords ? [...remainingWords] : [];
  
  // Store the initial word count for proper first-guess evaluation
  const initialWordCount = currentRemainingWords.length;
  
  // Store metrics for each guess
  const guessMetrics: GuessMetrics[] = [];
  
  // Track all previous guesses and their feedback for calculating new information
  const previousGuesses: string[] = [];
  const previousFeedback: LetterState[][] = [];
  
  // Analyze each guess
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const guessNumber = i + 1;
    
    // Get feedback for this guess
    const feedback = checkGuess(guess, targetWord);
    
    // Calculate luck for this guess (based on NEW discoveries only)
    const guessLuck = calculateLuckForGuess(guess, targetWord, previousGuesses, previousFeedback);
    totalLuck += guessLuck;
    
    // Calculate information gained with this guess (as percentage 0-100)
    const infoResult = calculateInformationGained(guess, targetWord, previousGuesses, previousFeedback);
    totalInformation += infoResult.informationValue;
    
    // Calculate skill based on information gained
    const guessSkill = calculateSkillForGuess(
      infoResult.informationValue,
      guessNumber,
      guess,
      previousGuesses,
      previousFeedback,
      targetWord
    );
    totalSkill += guessSkill;
    
    // Calculate remaining words
    const wordsRemaining = currentRemainingWords.length > 0
      ? calculateWordsRemaining(currentRemainingWords, guess, targetWord)
      : 0;
    
    // If this guess is correct, set remaining words to 0
    const displayWordsRemaining = feedback.every(state => state === 'correct') ? 0 : wordsRemaining;
    
    // Calculate words eliminated
    const wordsEliminated = currentRemainingWords.length - wordsRemaining;
    
    // Store metrics for this guess
    guessMetrics.push({
      guess,
      guessNumber,
      luck: guessLuck,
      skill: guessSkill,
      informationValue: infoResult.informationValue,
      wordsEliminated: wordsEliminated,
      wordsRemaining: displayWordsRemaining,
      feedback
    });
    
    // Track this guess for future iterations
    previousGuesses.push(guess);
    previousFeedback.push(feedback);
    
    // Update remaining words for next iteration
    if (currentRemainingWords.length > 0) {
      currentRemainingWords = filterRemainingWords(currentRemainingWords, guess, feedback);
    }
  }
  
  // Calculate average scores (helper functions already return 0-100 values)
  const averageLuck = guesses.length > 0 ? Math.round(totalLuck / guesses.length) : 0;
  const averageSkill = guesses.length > 0 ? Math.round(totalSkill / guesses.length) : 0;
  
  return {
    luck: averageLuck,
    skill: averageSkill,
    breakdown: {
      totalGuesses: guesses.length,
      optimalGuesses: Math.max(1, Math.ceil(Math.log2(initialWordCount || 100))), // Information theory optimal
      luckyGuesses: Math.round(totalLuck / Math.max(1, wordLength)),
      averageInformationGained: totalInformation / Math.max(1, guesses.length)
    },
    guessMetrics
  };
};
