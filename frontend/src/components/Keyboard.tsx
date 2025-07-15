import React from 'react';
import { LetterState } from '../types/game';

interface KeyProps {
  value: string;
  state?: LetterState;
  onClick: (key: string) => void;
  isLarge?: boolean;
}

const Key: React.FC<KeyProps> = ({ value, state, onClick, isLarge = false }) => {
  // Debug log for key states
  if (state && state !== 'empty' && state !== 'tbd') {
    console.log(`Key ${value} has state: ${state}`);
  }
  
  const getKeyClasses = () => {
    let classes = 'key';
    
    if (isLarge) {
      classes += ' px-4';
    }
    
    // Don't add state classes here - we'll handle colors with inline styles
    
    return classes;
  };

  const getKeyStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {};
    
    if (state === 'correct') {
      baseStyle.backgroundColor = '#6aaa64';
      baseStyle.color = 'white';
      console.log(`Setting ${value} to correct (green) style`);
    } else if (state === 'present') {
      baseStyle.backgroundColor = '#c9b458';
      baseStyle.color = 'white';
      console.log(`Setting ${value} to present (yellow) style`);
    } else if (state === 'absent') {
      baseStyle.backgroundColor = '#3a3a3c';
      baseStyle.color = 'white';
      console.log(`Setting ${value} to absent (dark gray) style`);
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

  return (
    <button
      className={getKeyClasses()}
      style={getKeyStyle()}
      onClick={() => onClick(value)}
      title={displayMapping ? `Apasă "${displayMapping}" pentru ${value}` : undefined}
    >
      <div className="flex flex-col items-center">
        <span className="uppercase">{value}</span>
        {displayMapping && (
          <span className="text-xs opacity-60 mt-1">{displayMapping}</span>
        )}
      </div>
    </button>
  );
};

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardLetters: Record<string, LetterState>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardLetters }) => {
  // Debug log to check keyboard letters state
  console.log('Keyboard received keyboardLetters:', keyboardLetters);
  
  // Romanian keyboard layout
  const firstRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ă'];
  const secondRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ș', 'ț'];
  const thirdRow = ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'î', 'â', 'BACKSPACE'];

  const renderRow = (keys: string[]) => (
    <div className="flex gap-1 justify-center">
      {keys.map((key) => (
        <Key
          key={key}
          value={key}
          state={keyboardLetters[key]}
          onClick={onKeyPress}
          isLarge={key === 'ENTER' || key === 'BACKSPACE'}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-2 p-4 max-w-lg mx-auto">
      {renderRow(firstRow)}
      {renderRow(secondRow)}
      {renderRow(thirdRow)}
    </div>
  );
};

export default Keyboard;
