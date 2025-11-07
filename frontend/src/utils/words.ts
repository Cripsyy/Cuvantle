// Default fallback words in case the file can't be loaded
const FALLBACK_WORDS: Record<number, string[]> = {
  3: ['cap', 'om', 'car', 'lac', 'rău', 'băi', 'câi', 'zar', 'bur', 'cor'],
  4: ['carte', 'casă', 'oraș', 'țară', 'lume', 'timp', 'mamă', 'tată', 'drum', 'masă'],
  5: ['carte', 'casă', 'oraș', 'țară', 'lume', 'timp', 'mamă', 'tată', 'copil', 'școală',
       'muncă', 'drum', 'masă', 'scaun', 'floare', 'soare', 'lună', 'stea', 'vânt',
       'ploaie', 'cald', 'rece', 'frumos', 'mare', 'mic', 'lung', 'scurt', 'înalt',
       'alb', 'negru', 'roșu', 'verde', 'galben', 'pământ', 'apă', 'foc', 'aer',
       'gheață', 'bun', 'rău', 'urât', 'jos', 'cer', 'pom', 'iarbă', 'grădină',
       'baie', 'pat', 'poartă', 'băiat', 'fată', 'bani', 'mașină', 'zăpadă'].filter(word => word.length === 5),
  6: ['carton', 'română', 'frumos', 'câmpie', 'munte', 'scris', 'citesc', 'învăț'],
  7: ['cuvânt', 'români', 'frumos', 'câmpie', 'munte', 'scris', 'citesc', 'învăț'],
  8: ['cuvinte', 'românii', 'frumoși', 'câmpiile', 'muntele', 'scriind', 'citind'],
  9: ['cuvintele', 'românilor', 'frumoșilor', 'câmpiilor', 'muntelor', 'scriitori']
};

// This will hold the loaded words for each length
let LOADED_WORDS: Record<number, string[]> = {};
let wordsLoaded: Record<number, boolean> = {};

// Function to load words from the file for a specific length
export const loadWordsFromFile = async (wordLength: number): Promise<string[]> => {
  if (wordsLoaded[wordLength] && LOADED_WORDS[wordLength]?.length > 0) {
    return LOADED_WORDS[wordLength];
  }

  try {
    const response = await fetch(`/romanian_${wordLength}_letter_words.txt`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${wordLength}-letter words file`);
    }
    const text = await response.text();
    LOADED_WORDS[wordLength] = text
      .split('\n')
      .map(word => word.trim().toLowerCase())
      .filter(word => word.length === wordLength);
    wordsLoaded[wordLength] = true;
    return LOADED_WORDS[wordLength];
  } catch (error) {
    console.warn(`Could not load ${wordLength}-letter words from file, using fallback word list:`, error);
    LOADED_WORDS[wordLength] = [...(FALLBACK_WORDS[wordLength] || [])];
    wordsLoaded[wordLength] = true;
    return LOADED_WORDS[wordLength];
  }
};

// Get current word list (loaded or fallback) for specific length
export const getWordList = (wordLength: number): string[] => {
  return LOADED_WORDS[wordLength]?.length > 0 ? LOADED_WORDS[wordLength] : (FALLBACK_WORDS[wordLength] || []);
};

export const getRandomWord = (wordLength: number): string => {
  const words = getWordList(wordLength);
  if (words.length === 0) {
    throw new Error(`No words available for length ${wordLength}`);
  }
  const randomIndex = Math.floor(Math.random() * words.length);
  const selectedWord = words[randomIndex];
  return selectedWord;
};

export const isValidWord = (word: string, wordLength: number): boolean => {
  const words = getWordList(wordLength);
  const isValid = words.includes(word.toLowerCase());
  return isValid;
};
