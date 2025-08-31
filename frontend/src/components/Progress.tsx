interface ProgressProps {
  progressiveLevel: number;
}


const Progress: React.FC<ProgressProps> = ({
  progressiveLevel,
}) => {

  const wordLengths = [3, 4, 5, 6, 7, 8, 9];

  const getDifficultyColor = (length: number): string => {
    if (length <= 4) return 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600';
    if (length <= 6) return 'bg-yellow-500 border-yellow-500 dark:bg-yellow-600 dark:border-yellow-600';
    return 'bg-red-500 border-red-500 dark:bg-red-600 dark:border-red-600';
  };

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex justify-center mt-2">
        {/* Render bullet indicators for progressive levels */}
        {wordLengths.map(level => (
          <div key={level} className="relative mx-1">
            <div className={`w-4 h-4 rounded-full border-2 transition-all ${getDifficultyColor(level)}`}/>
            {/* Arrow indicator for current level */}
            {level === progressiveLevel && (
              <div className="absolute transform -translate-x-1/2 top-4 left-1/2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
