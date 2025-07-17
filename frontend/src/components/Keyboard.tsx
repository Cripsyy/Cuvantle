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
      classes += ' w-20'; // Even wider for ENTER and BACKSPACE
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
      baseStyle.backgroundColor = '#505060';
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
        <div className="flex items-center h-4"> {/* Fixed height container for mapping */}
          {displayMapping && (
            <span className="text-xs opacity-60">{displayMapping}</span>
          )}
        </div>
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
  
  // Authentic Romanian keyboard layout
  const firstRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ă', 'î', 'â'];
  const secondRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ș', 'ț'];
  const thirdRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  return (
    <div className="flex flex-col max-w-2xl gap-2 p-4 mx-auto">
      {/* First row - Q to Â */}
      <div className="flex justify-center gap-1">
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
      <div className="flex justify-center gap-1">
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
      <div className="flex justify-center gap-1">
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
