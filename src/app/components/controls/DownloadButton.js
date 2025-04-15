'use client';

import { useTeams } from '@/app/context/TeamsContext';
import { useGameState } from '@/app/context/GameStateContext';
import { generateGameSummaryCSV, downloadCSV } from '@/app/utils/csvExport';

export default function DownloadButton() {
  const { teams, timeline } = useTeams();
  const { gameState } = useGameState();

  const handleDownload = () => {
    const csvContent = generateGameSummaryCSV(teams, timeline, gameState);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadCSV(csvContent, `game-summary-${timestamp}.csv`);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Download Game Summary
    </button>
  );
}