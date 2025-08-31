import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Board from '../components/Board';
import Keyboard from '../components/Keyboard';
import StatsModal from '../components/StatsModal';
import SettingsModal from '../components/SettingsModal';
import HelpModal from '../components/HelpModal';
import HintModal from '../components/HintModal';
import EndGameButtons from '../components/EndGameButtons';
import { GameState, Tile, GameStats, GameSettings, ProgressiveMode } from '../types/game';
import { getRandomWord, isValidWord, loadWordsFromFile } from '../utils/words';
import { checkGuess, updateKeyboardLetters, isGameWon, isGameLost, validateHardModeGuess } from '../utils/gameLogic';
import { getStoredStats, saveStats, updateStats } from '../utils/stats';
import { getStoredSettings, saveSettings} from '../utils/settings';
import { analyzeGame, GameAnalysis } from '../utils/analysis';
import { clearHintState } from '../utils/hintState';
import { 
  getStoredProgressiveMode, 
  saveProgressiveMode, 
  progressToNextLevel, 
  resetProgressiveMode, 
  exitProgressiveMode, 
  isProgressiveModeComplete,
  saveProgressiveGameState,
  hasSavedGameState
} from '../utils/progressiveMode';

const maxGuesses = 6;

const createEmptyTile = (): Tile => ({
  letter: '',
  state: 'empty'
});

const createEmptyBoard = (wordLength: number, maxGuesses: number): Tile[][] => {
  return Array(maxGuesses).fill(null).map(() => 
    Array(wordLength).fill(null).map(() => createEmptyTile())
  );
};

const Game: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in progressive mode based on the URL
  const isProgressiveMode = location.pathname.includes('/progressive');
  
  const [settings, setSettings] = useState<GameSettings>(() => getStoredSettings());
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [progressiveMode, setProgressiveMode] = useState<ProgressiveMode>(() => getStoredProgressiveMode());
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [shakingRow, setShakingRow] = useState<number | undefined>();
  const [message, setMessage] = useState<string>('');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [gameAnalysis, setGameAnalysis] = useState<GameAnalysis | null>(null);
  const [stats, setStats] = useState<GameStats>(() => getStoredStats());

  const currentWordLength = isProgressiveMode ? progressiveMode.currentLevel : settings.wordLength;

  // Apply dark mode to document
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  // Initialize game when component mounts or word length changes
  useEffect(() => {
    if (isProgressiveMode) {
      // Progressive mode initialization
      const currentProgressiveMode = getStoredProgressiveMode();
      if (!currentProgressiveMode.isActive) {
        // Start progressive mode if not active - always start at level 3
        const newMode = {
          ...currentProgressiveMode,
          isActive: true,
          currentLevel: 3,
          savedGameState: undefined // Clear any old saved state
        };
        setProgressiveMode(newMode);
        saveProgressiveMode(newMode);
        startNewProgressiveGame(3);
      } else {
        setProgressiveMode(currentProgressiveMode);
        // Load or restore progressive game
        if (hasSavedGameState(currentProgressiveMode)) {
          // Restore saved game state
          restoreProgressiveGame(currentProgressiveMode);
        } else {
          // Start new progressive game
          startNewProgressiveGame(currentWordLength);
        }
      }
    } else if (currentWordLength >= 3 && currentWordLength <= 9) {
      // Regular game mode
      const newSettings = { ...settings, wordLength: currentWordLength };
      setSettings(newSettings);
      saveSettings(newSettings);
      startNewGame(currentWordLength);
    } else {
      navigate('/');
    }
  }, [isProgressiveMode, currentWordLength]);

  const restoreProgressiveGame = (progressiveMode: ProgressiveMode) => {
    if (progressiveMode.savedGameState) {
      const loadAndRestore = async () => {
        setIsLoading(true);
        try {
          // Load the word list for the current progressive level
          await loadWordsFromFile(progressiveMode.currentLevel);
          
          const savedState = progressiveMode.savedGameState!;
          setGameState(savedState);
          
          // If the game is completed, regenerate the analysis
          if (savedState.gameStatus === 'won' || savedState.gameStatus === 'lost') {
            const analysis = analyzeGame(
              savedState.guesses, 
              savedState.targetWord, 
              savedState.gameStatus === 'won', 
              progressiveMode.currentLevel
            );
            setGameAnalysis(analysis);
          }
          
          setMessage('Jocul a fost restabilit!');
          setTimeout(() => setMessage(''), 2000);
        } catch (error) {
          console.error('Failed to restore progressive game:', error);
          setMessage('Eroare la încărcarea cuvintelor!');
          // Fallback to starting a new progressive game
          startNewProgressiveGame(progressiveMode.currentLevel);
        }
        setIsLoading(false);
      };
      
      loadAndRestore();
    }
  };

  const startNewProgressiveGame = async (wordLength: number) => {
    setIsLoading(true);
    setShowStatsModal(false);
    setShowSettingsModal(false);
    setShowHelpModal(false);
    setGameAnalysis(null);
    clearHintState();
    
    try {
      await loadWordsFromFile(wordLength);
      
      const newGameState = {
        board: createEmptyBoard(wordLength, maxGuesses),
        currentRow: 0,
        currentCol: 0,
        gameStatus: 'playing' as const,
        targetWord: getRandomWord(wordLength),
        guesses: [],
        keyboardLetters: {}
      };
      
      setGameState(newGameState);
      setMessage(`Mod progresiv - Nivel ${wordLength} litere`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to start new progressive game:', error);
      setMessage('Eroare la încărcarea cuvintelor!');
    }
    setIsLoading(false);
  };

  const startNewGame = async (wordLength: number) => {
    setIsLoading(true);
    setShowStatsModal(false);
    setShowSettingsModal(false);
    setShowHelpModal(false);
    setGameAnalysis(null);
    clearHintState();
    
    try {
      await loadWordsFromFile(wordLength);
      
      setGameState({
        board: createEmptyBoard(wordLength, maxGuesses),
        currentRow: 0,
        currentCol: 0,
        gameStatus: 'playing',
        targetWord: getRandomWord(wordLength),
        guesses: [],
        keyboardLetters: {}
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to start new game:', error);
      setMessage('Eroare la încărcarea cuvintelor!');
    }
    setIsLoading(false);
  };

  const handleWordLengthChange = (wordLength: number) => {
    // Update settings with new word length, which will trigger a new game
    const newSettings = { ...settings, wordLength };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleStatsReset = () => {
    const newStats = getStoredStats(); // This will return the reset stats from resetStats function
    setStats(newStats);
  };

  const handleProgressiveModeStart = () => {
    const newMode = {
      ...progressiveMode,
      isActive: true,
      currentLevel: 3
    };
    setProgressiveMode(newMode);
    saveProgressiveMode(newMode);
    navigate('/game/progressive');
  };

  const handleProgressiveModeExit = () => {
    const newMode = exitProgressiveMode(progressiveMode);
    setProgressiveMode(newMode);
    navigate('/');
  };

  const handleProgressiveModeComplete = () => {
    showMessage('🎉 Felicitări! Ai completat modul progresiv!', 5000);
    setTimeout(() => {
      setShowStatsModal(true);
    }, 2000);
  };

  const progressToNextLevelHandler = () => {
    const newMode = progressToNextLevel(progressiveMode);
    setProgressiveMode(newMode);
    
    if (isProgressiveModeComplete(newMode)) {
      handleProgressiveModeComplete();
    } else {
      // Start a new game at the next level without navigating
      startNewProgressiveGame(newMode.currentLevel);
    }
    setShowStatsModal(false);
  };

  const resetProgressiveModeHandler = () => {
    if (window.confirm('Ești sigur că vrei să resetezi modul progresiv? Vei începe din nou de la nivelul 3.')) {
      const resetMode = resetProgressiveMode(progressiveMode);
      setProgressiveMode(resetMode);
      
      // Start a new game at level 3
      startNewProgressiveGame(3);
      setShowStatsModal(false);
    }
  };

 const showMessage = (msg: string, duration: number = 2000) => {
  setMessage(msg);
  if (isFinite(duration)) {
    setTimeout(() => setMessage(''), duration);
  }
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
    if (!gameState || gameState.currentCol >= currentWordLength) return;

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
    if (gameState.currentCol !== currentWordLength) {
      showMessage('Nu ai suficiente litere!');
      setShakingRow(gameState.currentRow);
      setTimeout(() => setShakingRow(undefined), 500);
      return;
    }

    const currentGuess = gameState.board[gameState.currentRow]
      .map(tile => tile.letter)
      .join('');

    if (!isValidWord(currentGuess, currentWordLength)) {
      showMessage('Cuvântul nu există în dicționar!');
      setShakingRow(gameState.currentRow);
      setTimeout(() => setShakingRow(undefined), 500);
      return;
    }

    // Hard mode validation
    if (settings.isHardMode) {
      const hardModeValidation = validateHardModeGuess(
        currentGuess,
        gameState.guesses,
        gameState.targetWord
      );
      
      if (!hardModeValidation.isValid) {
        showMessage(hardModeValidation.errorMessage || 'Încălcare regulă mod greu!');
        setShakingRow(gameState.currentRow);
        setTimeout(() => setShakingRow(undefined), 500);
        return;
      }
    }

    // Calculate the guess states immediately
    const guessStates = checkGuess(currentGuess, gameState.targetWord);
    
    // Update the game state immediately
    setGameState(prevState => {
      if (!prevState) return prevState;
      const newBoard = [...prevState.board];
      const newGuesses = [...prevState.guesses, currentGuess];
      
      // Update the board with the guess states
      for (let i = 0; i < currentWordLength; i++) {
        newBoard[prevState.currentRow][i].state = guessStates[i];
      }

      const newKeyboardLetters = updateKeyboardLetters(
        prevState.keyboardLetters,
        currentGuess,
        guessStates
      );

      const won = isGameWon(newBoard, prevState.currentRow + 1);
      const lost = isGameLost(prevState.currentRow + 1, maxGuesses);

      let newGameStatus: 'playing' | 'won' | 'lost' = 'playing';
      if (won) {
        newGameStatus = 'won';
      } else if (lost) {
        newGameStatus = 'lost';
      }

      // Show end game messages and update stats
      setTimeout(() => {
        if (won) {
          if (isProgressiveMode) {
            showMessage('Felicitări! Ai ghicit cuvântul!', 5000);
            // In progressive mode, update stats and show modal
            const newStats = updateStats(stats, true, prevState.currentRow + 1, currentWordLength);
            setStats(newStats);
            saveStats(newStats);
            // Analyze the game
            const analysis = analyzeGame(newGuesses, prevState.targetWord, true, currentWordLength);
            setGameAnalysis(analysis);
            // Show stats modal with progressive mode options
            setTimeout(() => setShowStatsModal(true), 2000);
          } else {
            showMessage('Felicitări! Ai ghicit cuvântul!', 5000);
            // Regular mode stats update
            const newStats = updateStats(stats, true, prevState.currentRow + 1, currentWordLength);
            setStats(newStats);
            saveStats(newStats);
            // Analyze the game
            const analysis = analyzeGame(newGuesses, prevState.targetWord, true, currentWordLength);
            setGameAnalysis(analysis);
            // Show stats modal after a delay
            setTimeout(() => setShowStatsModal(true), 2000);
          }
        } else if (lost) {
          showMessage(`Cuvântul era: ${gameState.targetWord.toUpperCase()}`, Infinity);
          if (isProgressiveMode) {
            // In progressive mode, update stats and show modal
            const newStats = updateStats(stats, false, 0, currentWordLength);
            setStats(newStats);
            saveStats(newStats);
            // Analyze the game
            const analysis = analyzeGame(newGuesses, prevState.targetWord, false, currentWordLength);
            setGameAnalysis(analysis);
            // Show stats modal with reset option
            setTimeout(() => setShowStatsModal(true), 2000);
          } else {
            // Update stats for loss
            const newStats = updateStats(stats, false, 0, currentWordLength);
            setStats(newStats);
            saveStats(newStats);
            // Analyze the game
            const analysis = analyzeGame(newGuesses, prevState.targetWord, false, currentWordLength);
            setGameAnalysis(analysis);
            // Show stats modal after a delay
            setTimeout(() => setShowStatsModal(true), 2000);
          }
        }
      }, 600);

      const finalState = {
        ...prevState,
        board: newBoard,
        currentRow: prevState.currentRow + 1,
        currentCol: 0,
        gameStatus: newGameStatus,
        guesses: newGuesses,
        keyboardLetters: newKeyboardLetters
      };

      // Save progressive game state when game ends
      if (isProgressiveMode && (newGameStatus === 'won' || newGameStatus === 'lost')) {
        const updatedMode = saveProgressiveGameState(progressiveMode, finalState);
        setProgressiveMode(updatedMode);
      }

      return finalState;
    });

    // Auto-save progressive mode game state
    if (isProgressiveMode && gameState && gameState.gameStatus === 'playing') {
      setTimeout(() => {
        setGameState(currentState => {
          if (currentState && currentState.gameStatus === 'playing') {
            const updatedMode = saveProgressiveGameState(progressiveMode, currentState);
            setProgressiveMode(updatedMode);
          }
          return currentState;
        });
      }, 1000);
    }

    // Start the revealing animation after state update
    setIsRevealing(true);
    // Each tile has 100ms delay, last tile starts at (wordLength-1)*100ms + 600ms animation
    setTimeout(() => setIsRevealing(false), currentWordLength * 100 + 600);
  };

  const backToMenu = () => {
    navigate('/');
  };

  const handleAnalysisClick = () => {
    if (gameAnalysis && gameState) {
      navigate('/analysis', { 
        state: { 
          analysis: gameAnalysis, 
          guesses: gameState.guesses, 
          targetWord: gameState.targetWord, 
          gameWon: gameState.gameStatus === 'won' 
        } 
      });
    }
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

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  const handleHintClick = () => {
    setShowHintModal(true);
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
        onSettingsClick={handleSettingsClick}
        onHintClick={handleHintClick}
        onBackToMenu={backToMenu}
        isProgressiveMode={isProgressiveMode}
        progressiveLevel={isProgressiveMode ? progressiveMode.currentLevel : undefined}
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
          <div className="fixed z-50 px-4 py-2 text-center text-white transform -translate-x-1/2 bg-gray-800 rounded-md top-24 left-1/2 dark:bg-gray-700">
            {message}
          </div>
        )}
        
        <div className="mb-4">
          <Keyboard 
            onKeyPress={handleKeyPress}
            keyboardLetters={gameState.keyboardLetters}
          />
        </div>
        
        <EndGameButtons
          showStatsModal={showStatsModal}
          isProgressiveMode={isProgressiveMode}
          gameState={gameState}
          settings={settings}
          handleAnalysisClick={handleAnalysisClick}
          progressiveMode={progressiveMode}
          startNewGame={startNewGame}
          gameAnalysis={gameAnalysis}
          resetProgressiveMode={resetProgressiveModeHandler}
          onProgressToNextLevel={progressToNextLevelHandler}
          context="game"
        />
      </main>

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        isProgressiveMode={isProgressiveMode}
        progressiveLevel={progressiveMode.currentLevel}
      />

      <HintModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        wordLength={currentWordLength}
        targetedWord={gameState.targetWord}
      />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={stats}
        gameState={gameState}
        settings={settings}
        gameAnalysis={gameAnalysis ?? undefined}
        startNewGame={startNewGame}
        handleAnalysisClick={handleAnalysisClick}
        isProgressiveMode={isProgressiveMode}
        progressiveMode={progressiveMode}
        onProgressToNextLevel={progressToNextLevelHandler}
        onResetProgressiveMode={resetProgressiveModeHandler}
      />  
      
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onWordLengthChange={handleWordLengthChange}
        onStatsReset={handleStatsReset}
        onProgressiveModeStart={!isProgressiveMode ? handleProgressiveModeStart : undefined}
        resetProgressiveMode={resetProgressiveModeHandler}
        isProgressiveMode={isProgressiveMode}
      />
    </div>
  );
};

export default Game;