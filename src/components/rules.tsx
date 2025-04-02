import React from 'react';

const Rules: React.FC = () => {
  return (
    <div className="mt-4 p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Game Rules</h2>
      <ul className="list-disc pl-5">
        <li>Each row, column, and colored region must contain exactly one queen.</li>
        <li>No two queens can be adjacent, including diagonally.</li>
        <li>Left-click to place or remove a queen on a cell.</li>
        <li>Right-click to mark or unmark a cell with a cross (only if no queen is present).</li>
        <li>Click and drag to apply your action to multiple cells.</li>
        <li>Use the toolbar buttons to undo moves, clear the board, or solve the puzzle.</li>
        <li>The game is won when the board configuration matches the solution.</li>
      </ul>
    </div>
  );
};

export default Rules;
