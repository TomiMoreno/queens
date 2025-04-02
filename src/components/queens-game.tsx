import React, { useState, useEffect, useRef } from 'react';
import Header from './header';
import Board from './board';
import Toolbar from './toolbar';
import Rules from './rules';
import { CellState } from './types';
import { maps } from './maps';

export type BoardState = CellState[][];

const createEmptyBoard = (size: number): BoardState =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => CellState.Empty)
  );

// Validate the current board configuration based on game rules.
const isValidSolution = (board: BoardState, regions: number[][]): boolean => {
  const n = board.length;
  // Check exactly one queen per row.
  for (let i = 0; i < n; i++) {
    if (board[i].filter(cell => cell === CellState.Queen).length !== 1) return false;
  }
  // Check exactly one queen per column.
  for (let j = 0; j < n; j++) {
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (board[i][j] === CellState.Queen) count++;
    }
    if (count !== 1) return false;
  }
  // Check exactly one queen per region.
  const regionCounts: Record<number, number> = {};
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === CellState.Queen) {
        const region = regions[i][j];
        regionCounts[region] = (regionCounts[region] || 0) + 1;
      }
    }
  }
  for (const region in regionCounts) {
    if (regionCounts[region] !== 1) return false;
  }
  // Check immediate diagonal conflicts.
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]
  ];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === CellState.Queen) {
        for (const [di, dj] of directions) {
          const ni = i + di, nj = j + dj;
          if (ni >= 0 && ni < n && nj >= 0 && nj < n && board[ni][nj] === CellState.Queen) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

// Generate solution marks: for each queen, mark all immediately adjacent diagonal cells (if empty).
const generateSolutionWithMarks = (solutionBoard: BoardState): BoardState => {
  const n = solutionBoard.length;
  const newBoard = solutionBoard.map(row => [...row]);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (solutionBoard[i][j] !== CellState.Queen) {
        newBoard[i][j] = CellState.Marked;
      }
    }
  }
  return newBoard;
};
// Add the solver functions back:

// Backtracking solver enforcing one queen per row, column, region,
// and only preventing immediate diagonal conflicts with the previous row.
const solveQueens = (size: number, regions: number[][]): number[] | null => {
  const solution: number[] = [];
  const usedCols = new Set<number>();
  const usedRegions = new Set<number>();

  const backtrack = (row: number): boolean => {
    if (row === size) return true;
    for (let col = 0; col < size; col++) {
      if (usedCols.has(col)) continue;
      const region = regions[row][col];
      if (usedRegions.has(region)) continue;
      if (row > 0 && Math.abs(col - solution[row - 1]) === 1) continue;
      solution[row] = col;
      usedCols.add(col);
      usedRegions.add(region);
      if (backtrack(row + 1)) return true;
      usedCols.delete(col);
      usedRegions.delete(region);
    }
    return false;
  };

  return backtrack(0) ? solution : null;
};

// Convert a solution (array of column indices) to a BoardState.
const solutionToBoard = (solution: number[] | null, size: number): BoardState => {
  const board = createEmptyBoard(size);
  if (!solution) return board;
  solution.forEach((col, row) => {
    board[row][col] = CellState.Queen;
  });
  return board;
};


type DragMode = "left" | "right" | null;

const QueensGame: React.FC = () => {
  const mapKeys = Object.keys(maps);
  const [selectedMap, setSelectedMap] = useState<string>(mapKeys[0]);
  const [boardSize, setBoardSize] = useState<number>(maps[selectedMap].caseNumber);
  const [board, setBoard] = useState<BoardState>(createEmptyBoard(maps[selectedMap].caseNumber));
  const [regions, setRegions] = useState<number[][]>(maps[selectedMap].colorGrid);
  const [history, setHistory] = useState<BoardState[]>([]);
  const [solvedBoard, setSolvedBoard] = useState<BoardState | null>(null);
  const [won, setWon] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Start timer when game starts.
  useEffect(() => {
    if (gameStarted && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted]);

  // Reset timer when board is cleared or map changes.
  useEffect(() => {
    setGameStarted(false);
    setSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [selectedMap]);

  // Update board when the selected map changes.
  useEffect(() => {
    const mapData = maps[selectedMap];
    setBoardSize(mapData.caseNumber);
    setRegions(mapData.colorGrid);
    setBoard(createEmptyBoard(mapData.caseNumber));
    setHistory([]);
    // In a real implementation, you would generate the solution via your solver.
    // For now, we assume a pre-generated (or empty) solution board.
    setSolvedBoard(createEmptyBoard(mapData.caseNumber));
  }, [selectedMap]);

  // Left click: toggle queen.
  const updateCellLeft = (row: number, col: number, drag = false) => {
    // Start timer on first move.
    if (!gameStarted) setGameStarted(true);
    setHistory(prev => [...prev, board.map(r => [...r])]);
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          return drag ? CellState.Queen : (cell === CellState.Queen ? CellState.Empty : CellState.Queen);
        }
        return cell;
      })
    );
    setBoard(newBoard);
  };

  // Right click: toggle marked state (only if no queen is present).
  const updateCellRight = (row: number, col: number, drag = false) => {
    // Start timer on first move.
    if (!gameStarted) setGameStarted(true);
    setHistory(prev => [...prev, board.map(r => [...r])]);
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          if (cell === CellState.Queen) return cell;
          return drag ? (cell !== CellState.Marked ? CellState.Marked : cell)
                      : (cell === CellState.Marked ? CellState.Empty : CellState.Marked);
        }
        return cell;
      })
    );
    setBoard(newBoard);
  };

  // Validate board whenever it changes.
  useEffect(() => {
    const userWon = isValidSolution(board, regions);
    setWon(userWon);
    // stop timer when won
    if (userWon) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [board, regions]);

  const clearBoard = () => {
    setHistory(prev => [...prev, board.map(r => [...r])]);
    setBoard(createEmptyBoard(boardSize));
    setGameStarted(false);
    setSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const undo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setHistory(history.slice(0, history.length - 1));
      setBoard(prevState);
    }
  };

  // "Solve" button uses the pre-generated solution and adds marks.
  const solve = () => {
    if (solvedBoard) {
      const solution = solveQueens(boardSize, regions);
      const markedSolution = generateSolutionWithMarks(solutionToBoard(solution, boardSize));
      setHistory(prev => [...prev, board.map(r => [...r])]);
      setBoard(markedSolution);
    }
  };

  // Change map selection (also used by the random map button).
  const changeMap = (mapKey: string) => {
    setSelectedMap(mapKey);
  };

  return (
    <div className="flex flex-col items-center ">
      <Header won={won} seconds={seconds} />
      <div className="mb-4">
        <label htmlFor="mapSelect" className="mr-2">Select Map:</label>
        <select
          id="mapSelect"
          value={selectedMap}
          onChange={(e) => changeMap(e.target.value)}
          className="border px-2 py-1"
        >
          {mapKeys.map(key => (
            <option key={key} value={key}>{maps[key].name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4 min-h-[3rem]">
        {won && (
          <div className="p-2 bg-green-200 text-green-800 font-semibold rounded">
            You win!
          </div>
        )}
      </div>
      <Board
        board={board}
        regions={regions}
        onLeftClick={(r, c, drag = false) => updateCellLeft(r, c, drag)}
        onRightClick={(r, c, drag = false) => updateCellRight(r, c, drag)}
        dragMode={dragMode}
        setDragMode={setDragMode}
      />
      <Toolbar
        onUndo={undo}
        onClear={clearBoard}
        onSolve={solve}
        onRandomMap={() => {
          const randomKey = mapKeys[Math.floor(Math.random() * mapKeys.length)];
          changeMap(randomKey);
        }}
      />
      <Rules />
    </div>
  );
};

export default QueensGame;
