'use client';

import { useState, useEffect } from 'react';
import { useTeams } from '../context/TeamsContext';
import { useGameState } from '../context/GameStateContext';
import TeamSelectionModal from './TeamSelectionModal';

export default function GameInitializer({ children }) {
  const [showTeamSelection, setShowTeamSelection] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const { teams, setSelectedTeams: setActiveTeams } = useTeams();
  const { gameState } = useGameState();

  useEffect(() => {
    // Show team selection modal when game is not in progress
    if (!gameState.isRunning && selectedTeams.length !== 2) {
      setShowTeamSelection(true);
    }
  }, [gameState.isRunning, selectedTeams]);

  const handleTeamSelection = (selectedTeamIds) => {
    setSelectedTeams(selectedTeamIds);
    setActiveTeams(selectedTeamIds);
    setShowTeamSelection(false);
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