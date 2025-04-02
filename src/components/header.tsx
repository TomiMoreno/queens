import React from 'react';
import Confetti from 'react-confetti';

type HeaderProps = {
  won: boolean;
  seconds: number;
};

const Header: React.FC<HeaderProps> = ({ won, seconds }) => {
  return (
    <header className="w-full flex flex-col items-center py-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white relative shadow-lg">
      {won && (
        <Confetti
          recycle={false}
          numberOfPieces={500}
          className="absolute top-0 left-0 w-full h-full"
        />
      )}
      <h1 className="text-4xl font-extrabold tracking-wide text-shadow">
        Queens Game
      </h1>
      <div className="mt-3 text-lg font-medium bg-white/20 px-4 py-1 rounded-full">
        Time: {seconds}s
      </div>
    </header>
  );
};

export default Header;
