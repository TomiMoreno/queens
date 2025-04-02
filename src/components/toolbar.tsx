import React from 'react';

type ToolbarProps = {
  onUndo: () => void;
  onClear: () => void;
  onSolve: () => void;
  onRandomMap: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({ onUndo, onClear, onSolve, onRandomMap }) => {
  return (
    <div className="flex space-x-4 mt-4">
      <button onClick={onUndo} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
        Undo
      </button>
      <button onClick={onClear} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
        Clear
      </button>
      <button onClick={onSolve} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
        Solve
      </button>
      <button onClick={onRandomMap} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
        Random map
      </button>
    </div>
  );
};

export default Toolbar;
