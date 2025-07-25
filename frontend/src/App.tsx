import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import StatsModal from './components/StatsModal';
import { GameState, Tile, GameStats } from './types/game';
import { getRandomWord, isValidWord } from './utils/words';
import { checkGuess, updateKeyboardLetters, isGameWon, isGameLost } from './utils/gameLogic';
import { getStoredStats, saveStats, updateStats } from './utils/stats';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const createEmptyTile = (): Tile => ({
  letter: '',
  state: 'empty'
});

const createEmptyBoard = (): Tile[][] => {
  return Array(MAX_GUESSES).fill(null).map(() => 
    Array(WORD_LENGTH).fill(null).map(() => createEmptyTile())
  );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [shakingRow, setShakingRow] = useState<number | undefined>();
  const [message, setMessage] = useState<string>('');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [stats, setStats] = useState<GameStats>(() => getStoredStats());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Ensure words are loaded before initializing the game
  useEffect(() => {
    let isMounted = true;
    import('./utils/words').then(wordsModule => {
      wordsModule.loadWordsFromFile().then(() => {
        if (isMounted) {
          setGameState({
            board: createEmptyBoard(),
            currentRow: 0,
            currentCol: 0,
            gameStatus: 'playing',
            targetWord: wordsModule.getRandomWord(),
            guesses: [],
            keyboardLetters: {}
          });
          setIsLoading(false);
        }
      });
    });
    return () => { isMounted = false; };
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const showMessage = (msg: string, duration: number = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  const handleKeyPress = useCallback((key: string) => {
    if (!gameState || gameState.gameStatus !== 'playing' || isRevealing) {
      return;
    }

    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACKSPACE') {
      handleBackspace();
    } else if (key.length === 1 && /^[a-zăîâșț]$/i.test(key)) {
      handleLetterInput(key.toLowerCase());
    }
  }, [gameState?.gameStatus, gameState?.currentRow, gameState?.currentCol, isRevealing]);

  const handleLetterInput = (letter: string) => {
    if (!gameState || gameState.currentCol >= WORD_LENGTH) return;

    setGameState(prevState => {
      if (!prevState) return prevState;
      const newBoard = [...prevState.board];
      newBoard[prevState.currentRow][prevState.currentCol] = {
        letter: letter,
        state: 'tbd'
      };

      return {
        ...prevState,
        board: newBoard,
        currentCol: prevState.currentCol + 1
      };
    });
  };

  const handleBackspace = () => {
    if (!gameState || gameState.currentCol <= 0) return;

    setGameState(prevState => {
      if (!prevState) return prevState;
      const newBoard = [...prevState.board];
      newBoard[prevState.currentRow][prevState.currentCol - 1] = createEmptyTile();

      return {
        ...prevState,
        board: newBoard,
        currentCol: prevState.currentCol - 1
      };
    });
  };

  const handleSubmitGuess = () => {
    if (!gameState) return;
    if (gameState.currentCol !== WORD_LENGTH) {
      showMessage('Nu ai suficiente litere!');
      setShakingRow(gameState.currentRow);
      setTimeout(() => setShakingRow(undefined), 500);
      return;
    }

    const currentGuess = gameState.board[gameState.currentRow]
      .map(tile => tile.letter)
      .join('');

    if (!isValidWord(currentGuess)) {
      showMessage('Cuvântul nu există în dicționar!');
      setShakingRow(gameState.currentRow);
      setTimeout(() => setShakingRow(undefined), 500);
      return;
    }

    // Calculate the guess states immediately
    const guessStates = checkGuess(currentGuess, gameState.targetWord);
    
    // Update the game state immediately
    setGameState(prevState => {
      if (!prevState) return prevState;
      const newBoard = [...prevState.board];
      const newGuesses = [...prevState.guesses, currentGuess];
      
      // Update the board with the guess states
      for (let i = 0; i < WORD_LENGTH; i++) {
        newBoard[prevState.currentRow][i].state = guessStates[i];
      }

      const newKeyboardLetters = updateKeyboardLetters(
        prevState.keyboardLetters,
        currentGuess,
        guessStates
      );

      const won = isGameWon(newBoard, prevState.currentRow + 1);
      const lost = isGameLost(prevState.currentRow + 1, MAX_GUESSES);

      let newGameStatus: 'playing' | 'won' | 'lost' = 'playing';
      if (won) {
        newGameStatus = 'won';
      } else if (lost) {
        newGameStatus = 'lost';
      }

      // Show end game messages and update stats
      setTimeout(() => {
        if (won) {
          showMessage('Felicitări! Ai ghicit cuvântul!', 5000);
          // Update stats for win
          const newStats = updateStats(stats, true, prevState.currentRow + 1);
          setStats(newStats);
          saveStats(newStats);
          // Show stats modal after a delay
          setTimeout(() => setShowStatsModal(true), 2000);
        } else if (lost) {
          showMessage(`Cuvântul era: ${gameState.targetWord.toUpperCase()}`, 5000);
          // Update stats for loss
          const newStats = updateStats(stats, false, 0);
          setStats(newStats);
          saveStats(newStats);
          // Show stats modal after a delay
          setTimeout(() => setShowStatsModal(true), 2000);
        }
      }, 600);

      return {
        ...prevState,
        board: newBoard,
        currentRow: prevState.currentRow + 1,
        currentCol: 0,
        gameStatus: newGameStatus,
        guesses: newGuesses,
        keyboardLetters: newKeyboardLetters
      };
    });

    // Start the revealing animation after state update
    setIsRevealing(true);
    // Each tile has 100ms delay, last tile starts at 400ms + 600ms animation = 1000ms total
    setTimeout(() => setIsRevealing(false), 1000);
  };

  const resetGame = () => {
    import('./utils/words').then(wordsModule => {
      wordsModule.loadWordsFromFile().then(() => {
        setGameState({
          board: createEmptyBoard(),
          currentRow: 0,
          currentCol: 0,
          gameStatus: 'playing',
          targetWord: wordsModule.getRandomWord(),
          guesses: [],
          keyboardLetters: {}
        });
        setMessage('');
        setShowStatsModal(false);
      });
    });
  };

  // Romanian character mapping for keyboard input
  const romanianCharMap: Record<string, string> = {
    '[': 'ă',
    ']': 'î', 
    '\\': 'â',
    ';': 'ș',
    "'": 'ț'
  };

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      
      if (key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[a-z]$/i.test(key)) {
        handleKeyPress(key.toLowerCase());
      } else if (romanianCharMap[key]) {
        // Map Romanian characters from US keyboard layout
        handleKeyPress(romanianCharMap[key]);
      } else if (/^[ăîâșț]$/i.test(key)) {
        // Direct Romanian characters (if user has Romanian keyboard layout)
        handleKeyPress(key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const handleStatsClick = () => {
    setShowStatsModal(true);
  };

  const handleHelpClick = () => {
    // TODO: Implement help modal
    showMessage('Ghici cuvântul românesc de 5 litere în 6 încercări! Pentru diacritice: [ = ă, ] = î, \\ = â, ; = ș, \' = ț', 4000);
  };

  if (isLoading || !gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
        <div className="text-xl font-semibold">Se încarcă cuvintele...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Header 
        onStatsClick={handleStatsClick} 
        onHelpClick={handleHelpClick}
        isDarkMode={isDarkMode}
        onDarkModeToggle={toggleDarkMode}
      />
      
      <main className="flex flex-col items-center justify-center flex-1 py-8">
        <div className="mb-4">
          <Board 
            board={gameState.board}
            currentRow={gameState.currentRow}
            isRevealing={isRevealing}
            shakingRow={shakingRow}
          />
        </div>
        
        {message && (
          <div className="px-4 py-2 mb-4 text-center text-white bg-gray-800 rounded-md dark:bg-gray-700">
            {message}
          </div>
        )}
        
        <div className="mb-4">
          <Keyboard 
            onKeyPress={handleKeyPress}
            keyboardLetters={gameState.keyboardLetters}
          />
        </div>
        
        {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
          <button
            onClick={resetGame}
            className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Joc Nou
          </button>
        )}
      </main>
      
      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={stats}
      />
    </div>
  );
};

export default App;
