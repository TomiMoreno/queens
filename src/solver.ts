export type Board = number[];

export const solveNQueens = (n: number): Board[] => {
  const solutions: Board[] = [];
  const board: Board = [];

  const isSafe = (row: number, col: number): boolean => {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) {
        return false;
      }
    }
    return true;
  };

  const placeQueen = (row: number) => {
    if (row === n) {
      solutions.push([...board]);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        placeQueen(row + 1);
        board[row] = -1;
      }
    }
  };

  placeQueen(0);
  return solutions;
};
