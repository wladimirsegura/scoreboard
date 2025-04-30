'use client';

import { useGame } from '../../context/GameContext';

const ScoreboardDisplay = () => {
  const { gameState } = useGame();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-lg bg-[#0A192F] text-[#F3F4F6] border border-[#1E3A8A] shadow-lg">
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Home Team */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{gameState.homeTeam.name}</h2>
          <div className="text-5xl font-bold text-[#DC2626]">{gameState.homeTeam.score}</div>
          <div className="mt-2 text-[#9CA3AF]">Shots: {gameState.homeTeam.shots}</div>
        </div>

        {/* Game Info */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold mb-2">{gameState.clock}</div>
          <div className="text-xl text-[#9CA3AF]">Period {gameState.period}</div>
        </div>

        {/* Away Team */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{gameState.awayTeam.name}</h2>
          <div className="text-5xl font-bold text-[#DC2626]">{gameState.awayTeam.score}</div>
          <div className="mt-2 text-[#9CA3AF]">Shots: {gameState.awayTeam.shots}</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardDisplay;