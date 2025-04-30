'use client';

import { useState, useEffect } from 'react';
import { useTeams } from '../context/TeamsContext';
import { useGame } from '../contexts/GameContext';
import TeamSelectionModal from './TeamSelectionModal';

export default function GameInitializer({ children }) {
  const [showTeamSelection, setShowTeamSelection] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const { teams } = useTeams();
  const { gameState, initializeGame } = useGame();

  useEffect(() => {
    // Show team selection modal when game is not in progress
    if (!gameState.isRunning && selectedTeams.length !== 2) {
      setShowTeamSelection(true);
    }
  }, [gameState.isRunning, selectedTeams]);

  const handleTeamSelection = async (selectedTeamIds) => {
    try {
      const [homeTeamId, awayTeamId] = selectedTeamIds;
      await initializeGame(homeTeamId, awayTeamId);
      setSelectedTeams(selectedTeamIds);
      setShowTeamSelection(false);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      // Handle error appropriately
    }
  };

  const filteredChildren = () => {
    if (!selectedTeams.length) return null;
    return children;
  };

  return (
    <>
      <TeamSelectionModal
        isOpen={showTeamSelection}
        onClose={handleTeamSelection}
      />
      {filteredChildren()}
    </>
  );
}