import React, { useState, useMemo, useEffect } from "react";
import { getStoredHintState, saveHintState } from "../utils/hintState";
import { useClickOutside } from "../utils/useClickOutside";

interface HintModalProps {
  isOpen: boolean;
  onClose?: () => void;
  wordLength: number;
  targetedWord: string;
  onHintApplied?: (hintData: { letter: string; position: number } | null) => void;
}

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

const HintModal: React.FC<HintModalProps> = ({ 
  isOpen, 
  onClose, 
  wordLength, 
  targetedWord,
  onHintApplied
}) => {
  const [hintVisibility, setHintVisibility] = useState<HintVisibility>({});
  const [persistedHints, setPersistedHints] = useState<AvailableHints | null>(null);
  
  const handleClose = () => {
    onClose?.();
  };
  
  const { elementRef: modalRef, handleBackdropClick } = useClickOutside(handleClose);

  const isVowel = (char: string): boolean => {
    return /^[aăâeiîou]$/.test(char.toLowerCase());
  };

  const getDifficulty = (): 'easy' | 'medium' | 'hard' => {
    if (wordLength <= 4) return 'easy';
    if (wordLength <= 6) return 'medium';
    return 'hard';
  };

  const generateHints = useMemo((): AvailableHints => {
    if (persistedHints) {
      return persistedHints;
    }

    const difficulty = getDifficulty();
    const letters = targetedWord.toLowerCase().split('');
    
    // Get unique letters with their positions
    const uniqueVowels: HintData[] = [];
    const uniqueConsonants: HintData[] = [];
    const seenLetters = new Set<string>();

    letters.forEach((letter, index) => {
      if (!seenLetters.has(letter)) {
        seenLetters.add(letter);
        const hintData: HintData = {
          letter,
          position: index,
          type: isVowel(letter) ? 'vowel' : 'consonant'
        };

        if (isVowel(letter)) {
          uniqueVowels.push(hintData);
        } else {
          uniqueConsonants.push(hintData);
        }
      }
    });

    // Shuffle arrays for randomness only when generating new hints
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffledVowels = shuffleArray(uniqueVowels);
    const shuffledConsonants = shuffleArray(uniqueConsonants);

    // Return available hints based on difficulty
    switch (difficulty) {
      case 'easy':
        // Easy: 1 consonant available
        return {
          vowels: [],
          consonants: shuffledConsonants.slice(0, 1)
        };
      default:
        // Medium and Hard: 1 consonant + 1 vowel available
        return {
          vowels: shuffledVowels.slice(0, 1),
          consonants: shuffledConsonants.slice(0, 1)
        };
    }
  }, [targetedWord, wordLength, persistedHints]);

  // Load saved hint state when modal opens or when targetedWord changes
  useEffect(() => {
    if (isOpen) {
      const storedHintState = getStoredHintState(targetedWord, wordLength);
      if (storedHintState) {
        setHintVisibility(storedHintState.hintVisibility);
        if (storedHintState.availableHints) {
          setPersistedHints(storedHintState.availableHints);
        }
        
        // Restore hints to game board if they were previously revealed (hard difficulty only)
        if (wordLength >= 7 && onHintApplied && storedHintState.hintVisibility) {
          const hints = storedHintState.availableHints;
          if (hints) {
            // Apply vowel hint if it was visible
            if (storedHintState.hintVisibility.vowel && hints.vowels.length > 0) {
              onHintApplied({
                letter: hints.vowels[0].letter,
                position: hints.vowels[0].position
              });
            }
            
            // Apply consonant hint if it was visible
            if (storedHintState.hintVisibility.consonant && hints.consonants.length > 0) {
              onHintApplied({
                letter: hints.consonants[0].letter,
                position: hints.consonants[0].position
              });
            }
          }
        }
      } else {
        // Reset state for new word
        setHintVisibility({});
        setPersistedHints(null);
      }
    }
  }, [isOpen, targetedWord, wordLength]);
  
  // Save hint state whenever visibility changes or hints are generated
  useEffect(() => {
    if (isOpen && Object.keys(hintVisibility).length > 0) {
      saveHintState(targetedWord, wordLength, hintVisibility, generateHints);
    }
  }, [hintVisibility, targetedWord, wordLength, isOpen]); 

  const getDifficultyInfo = () => {
    const difficulty = getDifficulty();
    switch (difficulty) {
      case 'easy':
        return {
          name: 'Ușor',
          color: 'text-green-600 dark:text-green-400',
          maxHints: 1,
          description: 'Până la 1 consoană'
        };
      case 'medium':
        return {
          name: 'Mediu',
          color: 'text-yellow-600 dark:text-yellow-400',
          maxHints: 2,
          description: '1 consoană + 1 vocală'
        };
      case 'hard':
        return {
          name: 'Greu',
          color: 'text-red-600 dark:text-red-400',
          maxHints: 2,
          description: '1 consoană + 1 vocală + pozițiile acestora'
        };
    }
  };

  const difficultyInfo = getDifficultyInfo();

  const toggleHintVisibility = (type: 'vowel' | 'consonant') => {
    const newVisibility = !hintVisibility[type];
    
    setHintVisibility(prev => ({
      ...prev,
      [type]: newVisibility
    }));

    // Apply or remove hint to game board if we're on hard difficulty
    if (difficultyInfo.name === 'Greu' && onHintApplied) {
      const hintToApply = type === 'vowel' ? generateHints.vowels[0] : generateHints.consonants[0];
      if (hintToApply) {
        if (newVisibility) {
          // Apply hint
          onHintApplied({
            letter: hintToApply.letter,
            position: hintToApply.position
          });
        } else {
          // Remove this specific hint by passing a special object
          onHintApplied({
            letter: '',
            position: hintToApply.position
          });
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 md:items-center"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-t-2xl md:rounded-lg shadow-lg dark:bg-gray-800 animate-slide-up md:animate-none md:mx-4 max-h-[85vh] overflow-y-auto"
      >
        <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg font-bold sm:text-xl">Indicii</h2>
          <button
            onClick={handleClose}
            className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
              Dificultate: <span className={`font-semibold ${difficultyInfo.color}`}>
                {difficultyInfo.name}
              </span>
            </span>
            <span className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
              {wordLength} litere
            </span>
          </div>
          <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            Indicii disponibile: {difficultyInfo.description}
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base font-semibold sm:text-lg">Indicii disponibile</h3>
          </div>

          {(generateHints.vowels.length > 0 || generateHints.consonants.length > 0) ? (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              {/* Vowel hint */}
              {generateHints.vowels.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span>Vocală</span>
                    {hintVisibility.vowel && (
                      <div>
                        {difficultyInfo.name === 'Greu' 
                          ? `: "${generateHints.vowels[0].letter.toUpperCase()}" - Poziția ${generateHints.vowels[0].position + 1}`
                          : `: "${generateHints.vowels[0].letter.toUpperCase()}"`
                        }
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleHintVisibility('vowel')}
                    className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {hintVisibility.vowel ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.83 9.17999C14.2706 8.61995 13.5576 8.23846 12.7813 8.08386C12.0049 7.92926 11.2002 8.00851 10.4689 8.31152C9.73758 8.61453 9.11264 9.12769 8.67316 9.78607C8.23367 10.4444 7.99938 11.2184 8 12.01C7.99916 13.0663 8.41619 14.08 9.16004 14.83" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16.01C13.0609 16.01 14.0783 15.5886 14.8284 14.8384C15.5786 14.0883 16 13.0709 16 12.01" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.61 6.39004L6.38 17.62C4.6208 15.9966 3.14099 14.0944 2 11.99C6.71 3.76002 12.44 1.89004 17.61 6.39004Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.9994 3L17.6094 6.39" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.38 17.62L3 21" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5695 8.42999C20.4801 9.55186 21.2931 10.7496 21.9995 12.01C17.9995 19.01 13.2695 21.4 8.76953 19.23" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 11.98C8.09 1.31996 15.91 1.32996 22 11.98" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12.01C15.91 22.67 8.09 22.66 2 12.01" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              {/* Separator line if both hints exist */}
              {generateHints.vowels.length > 0 && generateHints.consonants.length > 0 && (
                <hr className="my-4 border-gray-400 border-t-1 dark:border-gray-500" />
              )}

              {/* Consonant hint */}
              {generateHints.consonants.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span>Consoană</span>
                    {hintVisibility.consonant && (
                      <div>
                        {difficultyInfo.name === 'Greu' 
                          ? `: "${generateHints.consonants[0].letter.toUpperCase()}" - Poziția ${generateHints.consonants[0].position + 1}`
                          : `: "${generateHints.consonants[0].letter.toUpperCase()}"`
                        }
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleHintVisibility('consonant')}
                    className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {hintVisibility.consonant ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.83 9.17999C14.2706 8.61995 13.5576 8.23846 12.7813 8.08386C12.0049 7.92926 11.2002 8.00851 10.4689 8.31152C9.73758 8.61453 9.11264 9.12769 8.67316 9.78607C8.23367 10.4444 7.99938 11.2184 8 12.01C7.99916 13.0663 8.41619 14.08 9.16004 14.83" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16.01C13.0609 16.01 14.0783 15.5886 14.8284 14.8384C15.5786 14.0883 16 13.0709 16 12.01" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.61 6.39004L6.38 17.62C4.6208 15.9966 3.14099 14.0944 2 11.99C6.71 3.76002 12.44 1.89004 17.61 6.39004Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.9994 3L17.6094 6.39" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.38 17.62L3 21" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5695 8.42999C20.4801 9.55186 21.2931 10.7496 21.9995 12.01C17.9995 19.01 13.2695 21.4 8.76953 19.23" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 11.98C8.09 1.31996 15.91 1.32996 22 11.98" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12.01C15.91 22.67 8.09 22.66 2 12.01" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-xs text-center text-gray-500 sm:text-sm dark:text-gray-400">
              Nu sunt disponibile indicii pentru acest cuvânt
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default HintModal;