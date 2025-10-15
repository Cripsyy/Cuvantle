import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameAnalysis } from '../utils/analysis';

interface AnalysisState {
  analysis: GameAnalysis;
  guesses: string[];
  targetWord: string;
  gameWon: boolean;
  isProgressive?: boolean;
}

const Analysis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as AnalysisState;

  // Redirect to home if no state is provided
  if (!state) {
    navigate('/');
    return null;
  }

  const { analysis, guesses, targetWord, gameWon, isProgressive } = state;
  
  // Track current guess being displayed (0-indexed, -1 means no guesses shown yet)
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);
  
  // Calculate cumulative scores up to current guess
  const cumulativeScores = useMemo(() => {
    if (currentGuessIndex < 0) {
      return { luck: 0, skill: 0, avgInformation: 0 };
    }
    
    const relevantMetrics = analysis.guessMetrics.slice(0, currentGuessIndex + 1);
    const totalLuck = relevantMetrics.reduce((sum, m) => sum + m.luck, 0);
    const totalSkill = relevantMetrics.reduce((sum, m) => sum + m.skill, 0);
    const totalInfo = relevantMetrics.reduce((sum, m) => sum + m.informationValue, 0);
    
    const count = relevantMetrics.length;
    
    // Normalize luck (scale to 0-100)
    const averageLuck = totalLuck / Math.max(1, count);
    const normalizedLuck = Math.min(100, Math.round(averageLuck * 10));
    
    // Normalize skill (based on information theory)
    const wordCount = relevantMetrics[0]?.wordsRemaining + relevantMetrics[0]?.wordsEliminated || 100;
    const maxPossibleInformation = Math.log2(wordCount) * count;
    const normalizedSkill = Math.min(100, Math.round((totalSkill / Math.max(1, maxPossibleInformation)) * 100));
    
    return {
      luck: normalizedLuck,
      skill: normalizedSkill,
      avgInformation: totalInfo / count
    };
  }, [currentGuessIndex, analysis.guessMetrics]);
  
  const handleNext = () => {
    if (currentGuessIndex < guesses.length - 1) {
      setCurrentGuessIndex(currentGuessIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentGuessIndex > 0) {
      setCurrentGuessIndex(currentGuessIndex - 1);
    }
  };
  
  const handleReset = () => {
    setCurrentGuessIndex(0);
  };
  
  const handleShowAll = () => {
    setCurrentGuessIndex(guesses.length - 1);
  };

  const getLuckDescription = (luck: number): string => {
    if (luck >= 80) return "Incredibil de norocos!";
    if (luck >= 60) return "Foarte norocos";
    if (luck >= 40) return "Destul de norocos";
    if (luck >= 20) return "Puțin norocos";
    return "Nu prea norocos";
  };

  const getSkillDescription = (skill: number): string => {
    if (skill >= 80) return "Strategie excelentă!";
    if (skill >= 60) return "Foarte abil";
    if (skill >= 40) return "Destul de abil";
    if (skill >= 20) return "Poate fi îmbunătățit";
    return "Necesită practică";
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Helper function to render a tile
  const renderTile = (letter: string, state: string) => {
    const stateColors = {
      correct: 'bg-green-600 border-green-600 text-white',
      present: 'bg-yellow-500 border-yellow-500 text-white',
      absent: 'bg-gray-400 border-gray-400 text-white dark:bg-gray-600 dark:border-gray-600',
      empty: 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
    };
    
    return (
      <div className={`w-12 h-12 md:w-14 md:h-14 border-2 flex items-center justify-center text-xl md:text-2xl font-bold rounded ${stateColors[state as keyof typeof stateColors] || stateColors.empty}`}>
        {letter.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                <span className="font-bold text-white">CB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">CuvântleBot</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analiza performanței tale</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
            >
              ← Înapoi acasă
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* Game Result */}
        <div className="p-6 mb-8 bg-gray-100 rounded-lg dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">
              {gameWon ? "🎉 Ai câștigat!" : "😞 Ai pierdut"}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Cuvântul era:&nbsp;
              <a
                className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline"
                href={`https://www.dexonline.ro/definitie/${encodeURIComponent(targetWord)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {targetWord.toUpperCase()}
              </a>
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left side - Grid and Controls */}
          <div className="flex flex-col space-y-6 rounded-lg bg-gray-50 dark:bg-gray-800">
            {/* Grid Display */}
            <div className="p-6">
              <h3 className="mb-4 text-xl font-semibold">Progresul încercărilor</h3>
              <div className="flex flex-col items-center space-y-3">
                {guesses.map((guess, guessIdx) => (
                  <div 
                    key={guessIdx}
                    className={`flex gap-2 transition-opacity ${guessIdx <= currentGuessIndex ? 'opacity-100' : 'opacity-20'}`}
                  >
                    {guess.split('').map((letter, letterIdx) => {
                      const state = guessIdx <= currentGuessIndex 
                        ? analysis.guessMetrics[guessIdx].feedback[letterIdx]
                        : 'empty';
                      return (
                        <div key={letterIdx}>
                          {renderTile(letter, state)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-3 sm:my-4 border-t-1" />

            {/* Navigation Controls */}
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Încercarea {currentGuessIndex + 1} din {guesses.length}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {analysis.guessMetrics[currentGuessIndex]?.wordsRemaining || 0} cuvinte rămase
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  disabled={currentGuessIndex === 0}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  ⏮ Prima
                </button>
                <button
                  onClick={handlePrevious}
                  disabled={currentGuessIndex === 0}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  ← Înapoi
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentGuessIndex === guesses.length - 1}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Înainte →
                </button>
                <button
                  onClick={handleShowAll}
                  disabled={currentGuessIndex === guesses.length - 1}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Ultima ⏭
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Scores */}
          <div className="flex flex-col space-y-6">
            {/* Luck Score */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
              <div className="text-center">
                <div className="mb-4 text-5xl font-bold">🍀</div>
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">NOROC</div>
                <div className={`text-5xl font-bold ${getScoreColor(cumulativeScores.luck)} mb-2`}>
                  {cumulativeScores.luck}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {getLuckDescription(cumulativeScores.luck)}
                </div>
              </div>
            </div>

            {/* Skill Score */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900">
              <div className="text-center">
                <div className="mb-4 text-5xl font-bold">🧠</div>
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">ABILITATE</div>
                <div className={`text-5xl font-bold ${getScoreColor(cumulativeScores.skill)} mb-2`}>
                  {cumulativeScores.skill}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {getSkillDescription(cumulativeScores.skill)}
                </div>
              </div>
            </div>

            {/* Information Value */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900">
              <div className="text-center">
                <div className="mb-4 text-5xl font-bold">📊</div>
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">INFORMAȚIE</div>
                <div className="mb-2 text-5xl font-bold text-green-600 dark:text-green-400">
                  {cumulativeScores.avgInformation.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Valoare medie
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
          <button
            onClick={() => navigate(isProgressive ? `/game/progressive/` : `/game/`)} 
            className="px-8 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Joacă din nou
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 font-semibold text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
          >
            Înapoi acasă
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
