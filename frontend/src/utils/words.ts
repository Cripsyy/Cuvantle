// Default fallback words in case the file can't be loaded
const FALLBACK_WORDS: string[] = [
  'carte', 'casă', 'oraș', 'țară', 'lume', 'timp', 'mamă', 'tată', 'copil', 'școală',
  'muncă', 'drum', 'masă', 'scaun', 'floare', 'soare', 'lună', 'stea', 'vânt',
  'ploaie', 'cald', 'rece', 'frumos', 'mare', 'mic', 'lung', 'scurt', 'înalt',
  'alb', 'negru', 'roșu', 'verde', 'galben', 'pământ', 'apă', 'foc', 'aer',
  'gheață', 'bun', 'rău', 'urât', 'jos', 'cer', 'pom', 'iarbă', 'grădină',
  'baie', 'pat', 'poartă', 'băiat', 'fată', 'bani', 'mașină', 'zăpadă'
].filter(word => word.length === 5);

// This will hold the loaded words
let LOADED_WORDS: string[] = [];
let wordsLoaded = false;

// Function to load words from the file
export const loadWordsFromFile = async (): Promise<string[]> => {
  if (wordsLoaded && LOADED_WORDS.length > 0) {
    return LOADED_WORDS;
  }

  try {
    const response = await fetch('/romanian_5_letter_words.txt');
    if (!response.ok) {
      throw new Error('Failed to fetch words file');
    }
    const text = await response.text();
    LOADED_WORDS = text
      .split('\n')
      .map(word => word.trim().toLowerCase())
      .filter(word => word.length === 5);
    
    wordsLoaded = true;
    console.log(`Loaded ${LOADED_WORDS.length} Romanian words`);
    return LOADED_WORDS;
  } catch (error) {
    console.warn('Could not load words from file, using fallback word list:', error);
    LOADED_WORDS = [...FALLBACK_WORDS];
    wordsLoaded = true;
    return LOADED_WORDS;
  }
};

// Get current word list (loaded or fallback)
export const getWordList = (): string[] => {
  return LOADED_WORDS.length > 0 ? LOADED_WORDS : FALLBACK_WORDS;
};

export const getRandomWord = (): string => {
  const words = getWordList();
  const randomIndex = Math.floor(Math.random() * words.length);
  const selectedWord = words[randomIndex];
  console.log('Selected target word:', selectedWord); // Debug log
  return selectedWord;
};

export const isValidWord = (word: string): boolean => {
  const words = getWordList();
  const isValid = words.includes(word.toLowerCase());
  console.log('Checking word validity:', word, 'Is valid:', isValid); // Debug log
  return isValid;
};

// Initialize word loading
loadWordsFromFile().catch(console.error);
