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
      classes += ' px-4';
    }
    
    if (state && state !== 'empty' && state !== 'tbd') {
      classes += ` key-${state}`;
    }
    
    return classes;
  };

  return (
    <button
      className={getKeyClasses()}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
};

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardLetters: Record<string, LetterState>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardLetters }) => {
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
