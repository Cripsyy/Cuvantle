import React from 'react';
import { Tile as TileType } from '../types/game';

interface TileProps {
  tile: TileType;
  isRevealing?: boolean;
  revealDelay?: number;
}

const Tile: React.FC<TileProps> = ({ tile, isRevealing = false, revealDelay = 0 }) => {
  const getTileClasses = () => {
    let classes = 'tile';
    
    if (tile.letter) {
      classes += ' tile-filled';
    }
    
    // Show the state immediately for better feedback
    if (tile.state === 'correct') {
      classes += ' tile-correct';
    } else if (tile.state === 'present') {
      classes += ' tile-present';
    } else if (tile.state === 'absent') {
      classes += ' tile-absent';
    }
    
    if (isRevealing) {
      classes += ' animate-flip';
    }
    
    return classes;
  };

  return (
    <div 
      className={getTileClasses()}
      style={{ animationDelay: isRevealing ? `${revealDelay}ms` : '0ms' }}
    >
      {tile.letter}
    </div>
  );
};

interface RowProps {
  tiles: TileType[];
  isRevealing?: boolean;
  isShaking?: boolean;
}

const Row: React.FC<RowProps> = ({ tiles, isRevealing = false, isShaking = false }) => {
  return (
    <div className={`flex gap-1 md:gap-2 ${isShaking ? 'animate-shake' : ''}`}>
      {tiles.map((tile, index) => (
        <Tile 
          key={index} 
          tile={tile} 
          isRevealing={isRevealing}
          revealDelay={index * 100}
        />
      ))}
    </div>
  );
};

interface BoardProps {
  board: TileType[][];
  currentRow: number;
  isRevealing?: boolean;
  shakingRow?: number;
}

const Board: React.FC<BoardProps> = ({ 
  board, 
  currentRow, 
  isRevealing = false,
  shakingRow 
}) => {
  return (
    <div className="flex flex-col gap-2 p-4">
      {board.map((row, index) => (
        <Row 
          key={index} 
          tiles={row} 
          isRevealing={isRevealing && index === currentRow - 1}
          isShaking={shakingRow === index}
        />
      ))}
    </div>
  );
};

export default Board;
