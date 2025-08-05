import React from 'react';
import { GameAnalysis } from '../utils/analysis';

interface CuvantleBotProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: GameAnalysis;
  guesses: string[];
  targetWord: string;
  gameWon: boolean;
}

const CuvantleBot: React.FC<CuvantleBotProps> = ({ 
  isOpen, 
  onClose, 
  analysis, 
  guesses, 
  targetWord, 
  gameWon 
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CB</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CuvântleBot</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Game Result */}
        <div className="mb-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              {gameWon ? "🎉 Ai câștigat!" : "😞 Ai pierdut"}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Cuvântul era: <span className="font-bold text-gray-900 dark:text-gray-100">{targetWord.toUpperCase()}</span>
            </span>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Luck Score */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🍀</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">NOROC</div>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.luck)} mb-1`}>
                {analysis.luck}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getLuckDescription(analysis.luck)}
              </div>
            </div>
          </div>

          {/* Skill Score */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🧠</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">ABILITATE</div>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.skill)} mb-1`}>
                {analysis.skill}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getSkillDescription(analysis.skill)}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Analiza detaliată
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Numărul de încercări:</span>
              <span className="font-semibold">{analysis.breakdown.totalGuesses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Încercări optime estimate:</span>
              <span className="font-semibold">{analysis.breakdown.optimalGuesses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Informații medii per încercare:</span>
              <span className="font-semibold">{analysis.breakdown.averageInformationGained.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Guess Analysis */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Analiza încercărilor
          </h3>
          <div className="space-y-2">
            {guesses.map((guess, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    {index + 1}
                  </span>
                  <span className="font-bold text-lg tracking-wider">
                    {guess.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {index === 0 ? "Prima încercare" : 
                   index === guesses.length - 1 && gameWon ? "Încercare câștigătoare!" :
                   `Încercarea ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mb-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            💡 Sfaturi pentru îmbunătățire:
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
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
          </ul>
        </div>

        {/* Close Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Închide analiza
          </button>
        </div>
      </div>
    </div>
  );
};

export default CuvantleBot;
