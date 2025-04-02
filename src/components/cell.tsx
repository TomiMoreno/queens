import React from 'react';
import { CellState } from './types';

type CellProps = {
  state: CellState;
  region: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const regionColors: Record<number, string> = {
  0: 'bg-gray-200',
  1: 'bg-blue-200',
  2: 'bg-green-200',
  3: 'bg-yellow-200',
  4: 'bg-purple-200',
  5: 'bg-red-200',
  6: 'bg-pink-200',
  7: 'bg-indigo-200',
  8: 'bg-orange-200',
  9: 'bg-teal-200',
  10: 'bg-gray-200',
};

const Cell: React.FC<CellProps> = ({ state, region, onMouseDown, onMouseEnter, onMouseLeave }) => {
  let content = '';
  if (state === CellState.Queen) {
    content = '👑';
  } else if (state === CellState.Marked) {
    content = 'X';
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`w-16 h-16 flex items-center justify-center border cursor-pointer hover:filter hover:brightness-125 ${regionColors[region] || 'bg-gray-200'}`}
    >
      <span className="text-xl font-bold">{content}</span>
    </div>
  );
};

export default Cell;
