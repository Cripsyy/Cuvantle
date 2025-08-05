import { checkGuess } from './gameLogic';

export interface GameAnalysis {
  luck: number;
  skill: number;
  breakdown: {
    totalGuesses: number;
    optimalGuesses: number;
    luckyGuesses: number;
    averageInformationGained: number;
  };
}

// Helper function to calculate letter frequency in a word list
const calculateLetterFrequency = (words: string[]): Map<string, number> => {
  const frequency = new Map<string, number>();
  const totalLetters = words.join('').length;
  
  for (const word of words) {
    for (const letter of word) {
      frequency.set(letter, (frequency.get(letter) || 0) + 1);
    }
  }
  
  // Convert to percentages
  for (const [letter, count] of frequency) {
    frequency.set(letter, count / totalLetters);
  }
  
  return frequency;
};

// Calculate how much information a guess provides
const calculateInformationValue = (guess: string, targetWord: string, remainingWords: string[]): number => {
  const guessResult = checkGuess(guess, targetWord);
  let informationValue = 0;
  
  // Points for correct letters in correct positions (green)
  const greenCount = guessResult.filter(state => state === 'correct').length;
  informationValue += greenCount * 2;
  
  // Points for correct letters in wrong positions (yellow)
  const yellowCount = guessResult.filter(state => state === 'present').length;
  informationValue += yellowCount * 1;
  
  // Points for eliminating letters (gray)
  const grayCount = guessResult.filter(state => state === 'absent').length;
  informationValue += grayCount * 0.5;
  
  return informationValue;
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

// Calculate skill based on word choice quality and strategy
const calculateSkillForGuess = (guess: string, guessNumber: number, wordLength: number): number => {
  let skillScore = 0;
  
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
  wordLength: number
): GameAnalysis => {
  let totalLuck = 0;
  let totalSkill = 0;
  let totalInformation = 0;
  
  // Analyze each guess
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const guessNumber = i + 1;
    
    // Calculate luck for this guess
    const guessLuck = calculateLuckForGuess(guess, targetWord, guessNumber);
    totalLuck += guessLuck;
    
    // Calculate skill for this guess
    const guessSkill = calculateSkillForGuess(guess, guessNumber, wordLength);
    totalSkill += guessSkill;
    
    // Calculate information value
    const informationValue = calculateInformationValue(guess, targetWord, []); // Simplified for now
    totalInformation += informationValue;
  }
  
  // Normalize scores to 0-100 scale
  const maxPossibleLuck = guesses.length * wordLength * 2; // Maximum theoretical luck
  const maxPossibleSkill = guesses.length * 5; // Maximum theoretical skill
  
  const normalizedLuck = Math.min(100, Math.round((totalLuck / Math.max(1, maxPossibleLuck)) * 100));
  const normalizedSkill = Math.min(100, Math.round((totalSkill / Math.max(1, maxPossibleSkill)) * 100));
  
  // Bonus for winning
  const finalLuck = gameWon ? Math.min(100, normalizedLuck + 10) : normalizedLuck;
  const finalSkill = gameWon ? Math.min(100, normalizedSkill + 10) : normalizedSkill;
  
  return {
    luck: finalLuck,
    skill: finalSkill,
    breakdown: {
      totalGuesses: guesses.length,
      optimalGuesses: Math.max(1, Math.ceil(wordLength / 2)), // Theoretical optimal
      luckyGuesses: Math.round(totalLuck / Math.max(1, wordLength)),
      averageInformationGained: totalInformation / Math.max(1, guesses.length)
    }
  };
};
