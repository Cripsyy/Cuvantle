interface HintData {
  letter: string;
  position: number;
  type: 'vowel' | 'consonant';
}

interface AvailableHints {
  vowels: HintData[];
  consonants: HintData[];
}

interface HintVisibility {
  [key: string]: boolean;
}

interface HintState {
  targetWord: string;
  wordLength: number;
  hintVisibility: HintVisibility;
  availableHints: AvailableHints;
}

const HINT_STATE_KEY = 'cuvantle-hint-state';

export const getStoredHintState = (targetWord: string, wordLength: number): { hintVisibility: HintVisibility; availableHints?: AvailableHints } | null => {
  try {
    const stored = localStorage.getItem(HINT_STATE_KEY);
    if (stored) {
      const parsed: HintState = JSON.parse(stored);
      // Check if the stored hint state matches the current word and length
      if (parsed.targetWord === targetWord && parsed.wordLength === wordLength) {
        return {
          hintVisibility: parsed.hintVisibility,
          availableHints: parsed.availableHints
        };
      }
    }
  } catch (error) {
    console.warn('Failed to parse stored hint state:', error);
  }
  return null;
};

export const saveHintState = (
  targetWord: string, 
  wordLength: number, 
  hintVisibility: HintVisibility, 
  availableHints: AvailableHints
): void => {
  try {
    const hintState: HintState = {
      targetWord,
      wordLength,
      hintVisibility,
      availableHints
    };
    localStorage.setItem(HINT_STATE_KEY, JSON.stringify(hintState));
  } catch (error) {
    console.warn('Failed to save hint state:', error);
  }
};

export const clearHintState = (): void => {
  try {
    localStorage.removeItem(HINT_STATE_KEY);
  } catch (error) {
    console.warn('Failed to clear hint state:', error);
  }
};
