import React from 'react';
import { LetterState } from '../types/game';

interface KeyProps {
  value: string;
  state?: LetterState;
  onClick: (key: string) => void;
  isLarge?: boolean;
}

const Key: React.FC<KeyProps> = ({ value, state, onClick, isLarge = false }) => {  
  const getKeyClasses = () => {
    let classes = 'key';
    
    if (isLarge) {
      classes += ' key-large';
    }
    
    return classes;
  };

  const getKeyStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {};

    if (state === 'correct') {
      baseStyle.backgroundColor = '#6aaa64';
    } else if (state === 'present') {
      baseStyle.backgroundColor = '#c9b458';
    } else if (state === 'absent') {
      baseStyle.backgroundColor = '#505060';
    }

    return baseStyle;
  };

  // Romanian character mappings for display
  const romanianMappings: Record<string, string> = {
    'ă': '[',
    'î': ']',
    'â': '\\',
    'ș': ';',
    'ț': "'"
  };

  const displayMapping = romanianMappings[value];

  const renderKeyContent = () => {
    if (value === "BACKSPACE") {
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-4 h-4 md:w-6 md:h-6"
        >
          <path 
            d="M22 3H7C6.31 3 5.77 3.35 5.41 3.88L0 12L5.41 20.11C5.77 20.64 6.31 21 7 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3ZM19 15.59L17.59 17L14 13.41L10.41 17L9 15.59L12.59 12L9 8.41L10.41 7L14 10.59L17.59 7L19 8.41L15.41 12L19 15.59Z" 
            fill="currentColor"
          />
        </svg>
      );
    }

    if (value === "ENTER") {
      return <span className="text-xs font-bold uppercase md:text-sm">ENTER</span>;
    }

    return (
      <div className="flex flex-col items-center">
        <span className="text-sm uppercase md:text-base">{value}</span>
        <div className="items-center hidden h-4 md:flex">
          {displayMapping && (
            <span className="text-xs opacity-60">{displayMapping}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <button
      className={getKeyClasses()}
      style={getKeyStyle()}
      onClick={() => onClick(value)}
      title={displayMapping ? `Apasă "${displayMapping}" pentru ${value}` : undefined}
    >
      {renderKeyContent()}
    </button>
  );
};

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardLetters: Record<string, LetterState>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardLetters }) => {  
  const firstRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ă', 'î', 'â'];
  const secondRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ș', 'ț'];
  const thirdRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  return (
    <div className="flex flex-col max-w-2xl gap-1 p-1 mx-auto md:gap-2 md:p-4">
      {/* First row - Q to Â */}
      <div className="flex justify-center gap-0.5 md:gap-1">
        {firstRow.map((key) => (
          <Key
            key={key}
            value={key}
            state={keyboardLetters[key]}
            onClick={onKeyPress}
            isLarge={false}
          />
        ))}
      </div>
      
      {/* Second row - A to Ț with slight stagger */}
      <div className="flex justify-center gap-0.5 md:gap-1">
        {secondRow.map((key) => (
          <Key
            key={key}
            value={key}
            state={keyboardLetters[key]}
            onClick={onKeyPress}
            isLarge={false}
          />
        ))}
      </div>
      
      {/* Third row - ENTER, letters, BACKSPACE */}
      <div className="flex justify-center gap-0.5 md:gap-1">
        <Key
          value="ENTER"
          state={keyboardLetters['ENTER']}
          onClick={onKeyPress}
          isLarge={true}
        />
        {thirdRow.map((key) => (
          <Key
            key={key}
            value={key}
            state={keyboardLetters[key]}
            onClick={onKeyPress}
            isLarge={false}
          />
        ))}
        <Key
          value="BACKSPACE"
          state={keyboardLetters['BACKSPACE']}
          onClick={onKeyPress}
          isLarge={true}
        />
      </div>
    </div>
  );
};

export default Keyboard;
