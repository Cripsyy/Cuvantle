import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import { GameState, Tile } from './types/game';
import { getRandomWord, isValidWord } from './utils/words';
import { checkGuess, updateKeyboardLetters, isGameWon, isGameLost } from './utils/gameLogic';

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
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentRow: 0,
    currentCol: 0,
    gameStatus: 'playing',
    targetWord: getRandomWord(),
    guesses: [],
    keyboardLetters: {}
  });

  const [isRevealing, setIsRevealing] = useState(false);
  const [shakingRow, setShakingRow] = useState<number | undefined>();
  const [message, setMessage] = useState<string>('');

  const showMessage = (msg: string, duration: number = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing' || isRevealing) {
      return;
    }

    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACKSPACE') {
      handleBackspace();
    } else if (key.length === 1 && /^[a-zăîâșț]$/i.test(key)) {
      handleLetterInput(key.toLowerCase());
    }
  }, [gameState.gameStatus, gameState.currentRow, gameState.currentCol, isRevealing]);

  const handleLetterInput = (letter: string) => {
    if (gameState.currentCol >= WORD_LENGTH) return;

    setGameState(prevState => {
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
    if (gameState.currentCol <= 0) return;

    setGameState(prevState => {
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

      // Show end game messages
      setTimeout(() => {
        if (won) {
          showMessage('Felicitări! Ai ghicit cuvântul!', 5000);
        } else if (lost) {
          showMessage(`Cuvântul era: ${gameState.targetWord.toUpperCase()}`, 5000);
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
    setTimeout(() => setIsRevealing(false), 600);
  };

  const resetGame = () => {
    setGameState({
      board: createEmptyBoard(),
      currentRow: 0,
      currentCol: 0,
      gameStatus: 'playing',
      targetWord: getRandomWord(),
      guesses: [],
      keyboardLetters: {}
    });
    setMessage('');
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
    // TODO: Implement stats modal
    showMessage('Statisticile vor fi disponibile în curând!');
  };

  const handleHelpClick = () => {
    // TODO: Implement help modal
    showMessage('Ghici cuvântul românesc de 5 litere în 6 încercări! Pentru diacritice: [ = ă, ] = î, \\ = â, ; = ș, \' = ț', 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onStatsClick={handleStatsClick} onHelpClick={handleHelpClick} />
      
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="mb-4">
          <Board 
            board={gameState.board}
            currentRow={gameState.currentRow}
            isRevealing={isRevealing}
            shakingRow={shakingRow}
          />
        </div>
        
        {message && (
          <div className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md text-center">
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Joc Nou
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
