import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameAnalysis } from '../utils/analysis';

interface AnalysisState {
  analysis: GameAnalysis;
  guesses: string[];
  targetWord: string;
  gameWon: boolean;
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

  const { analysis, guesses, targetWord, gameWon } = state;

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">CB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">CuvântleBot</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analiza performanței tale</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Înapoi acasă
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Game Result */}
        <div className="mb-8 p-6 rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">
              {gameWon ? "🎉 Ai câștigat!" : "😞 Ai pierdut"}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Cuvântul era: <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{targetWord.toUpperCase()}</span>
            </span>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Luck Score */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">🍀</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">NOROC</div>
              <div className={`text-5xl font-bold ${getScoreColor(analysis.luck)} mb-2`}>
                {analysis.luck}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {getLuckDescription(analysis.luck)}
              </div>
            </div>
          </div>

          {/* Skill Score */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900">
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">🧠</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">ABILITATE</div>
              <div className={`text-5xl font-bold ${getScoreColor(analysis.skill)} mb-2`}>
                {analysis.skill}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {getSkillDescription(analysis.skill)}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Breakdown */}
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Analiza detaliată</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.breakdown.totalGuesses}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Încercări totale</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analysis.breakdown.optimalGuesses}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Încercări optime</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {analysis.breakdown.averageInformationGained.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Info/încercare</div>
            </div>
          </div>
        </div>

        {/* Guess Analysis */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Analiza încercărilor</h3>
          <div className="space-y-3">
            {guesses.map((guess, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-mono bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full">
                    {index + 1}
                  </span>
                  <span className="font-bold text-xl tracking-wider">
                    {guess.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {index === 0 ? "Prima încercare" : 
                   index === guesses.length - 1 && gameWon ? "Încercare câștigătoare!" :
                   `Încercarea ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mb-8 p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3 text-lg">
            💡 Sfaturi pentru îmbunătățire:
          </h4>
          <ul className="text-yellow-700 dark:text-yellow-300 space-y-2">
            {analysis.skill < 50 && (
              <li>• Încearcă să folosești cuvinte cu multe vocale în primele încercări</li>
            )}
            {analysis.luck > 70 && (
              <li>• Ai avut noroc! Încearcă să dezvolți strategii mai consistente</li>
            )}
            {analysis.breakdown.totalGuesses > 4 && (
              <li>• Analizează mai atent informațiile din fiecare încercare</li>
            )}
            <li>• Evită să repeți litere eliminate în încercările următoare</li>
            <li>• Prima încercare ar trebui să conțină litere comune (a, e, i, r, n, t)</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(`/game/${targetWord.length}`)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-semibold"
          >
            Joacă din nou
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 transition-colors font-semibold"
          >
            Înapoi acasă
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
