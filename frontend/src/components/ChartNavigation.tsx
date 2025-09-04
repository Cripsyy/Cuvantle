import React, { useState, useRef, useEffect } from 'react';

export interface ChartOption<T> {
  id: T;
  title: string;
}

interface ChartNavigationProps<T> {
  chartOptions: ChartOption<T>[];
  currentChart: T;
  onChartChange: (chartId: T) => void;
  className?: string;
}

function ChartNavigation<T extends string | number>({ 
  chartOptions, 
  currentChart, 
  onChartChange,
  className = ""
}: ChartNavigationProps<T>) {
  const currentIndex = chartOptions.findIndex(option => option.id === currentChart);
  // Prevent rapid double-clicks by disabling navigation briefly after a click
  const [isNavigating, setIsNavigating] = useState(false);
  const navTimer = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (navTimer.current) {
        window.clearTimeout(navTimer.current);
      }
    };
  }, []);
  
  const goToPrevious = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : chartOptions.length - 1;
    onChartChange(chartOptions[previousIndex].id);
    if (navTimer.current) window.clearTimeout(navTimer.current);
    navTimer.current = window.setTimeout(() => setIsNavigating(false), 250);
  };

  const goToNext = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    const nextIndex = currentIndex < chartOptions.length - 1 ? currentIndex + 1 : 0;
    onChartChange(chartOptions[nextIndex].id);
    if (navTimer.current) window.clearTimeout(navTimer.current);
    navTimer.current = window.setTimeout(() => setIsNavigating(false), 250);
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex items-center gap-4">
        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          disabled={isNavigating}
          className="p-1 text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          title="Graficul anterior"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Bullet Indicators */}
        <div className="flex gap-3">
          {chartOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onChartChange(option.id)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentChart === option.id
                  ? 'bg-gray-800 dark:bg-gray-200 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              title={option.title}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          disabled={isNavigating}
          className={`p-1 text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100`}
          title="Graficul următor"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChartNavigation;
