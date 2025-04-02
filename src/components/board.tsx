import React from 'react';
import Cell from './cell';
import { BoardState } from './queens-game';
import { CellState } from './types';

type BoardProps = {
  board: BoardState;
  regions: number[][];
  onLeftClick: (row: number, col: number, drag?: boolean) => void;
  onRightClick: (row: number, col: number, drag?: boolean) => void;
  dragMode: "left" | "right" | null;
  setDragMode: (mode: "left" | "right" | null) => void;
};

const Board: React.FC<BoardProps> = ({ board, regions, onLeftClick, onRightClick, dragMode, setDragMode }) => {
  return (
    <div
      className="grid" // no gap between cells
      style={{ gridTemplateColumns: `repeat(${board.length}, 4rem)` }}
      onMouseUp={() => setDragMode(null)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {board.map((row, i) =>
        row.map((cellState: CellState, j: number) => (
          <Cell
            key={`${i}-${j}`}
            state={cellState}
            region={regions[i][j]}
            onMouseDown={(e) => {
              if (e.button === 0) {
                onLeftClick(i, j);
                setDragMode("left");
              } else if (e.button === 2) {
                onRightClick(i, j);
                setDragMode("right");
              }
            }}
            onMouseEnter={() => {
              if (dragMode === "left") {
                onLeftClick(i, j, true);
              } else if (dragMode === "right") {
                onRightClick(i, j, true);
              }
            }}
          />
        ))
      )}
    </div>
  );
};

export default Board;
