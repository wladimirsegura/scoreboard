'use client';

import { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { useTeams } from '../../context/TeamsContext';
import GoalModal from './GoalModal';
import DecreaseModal from './DecreaseModal';
import DownloadButton from './DownloadButton';

const AdminControls = () => {
  const { gameState, handleShotChange, handlePeriodChange, handleClockToggle, handleScoreChange } = useGameState();
  const { teams, recordGoal, getActiveTeams } = useTeams();
  const [goalTime, setGoalTime] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDecreaseModal, setShowDecreaseModal] = useState(false);
  const [scoringTeamId, setScoringTeamId] = useState(null);
  const [decreaseTeamId, setDecreaseTeamId] = useState(null);
  const [scoreTime, setScoreTime] = useState(null);
  const isClockRunning = gameState.isRunning;
  const elapsedTime = gameState.elapsedTimeString || '00:00';
  const activeTeams = getActiveTeams();

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 rounded-lg bg-[#1F2937] text-[#F3F4F6] border border-[#1E3A8A] shadow-lg">
      <div className="grid grid-cols-3 gap-8">
        {/* Home Team Controls */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">{activeTeams[0]?.name || 'Home Team'}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setScoringTeamId(activeTeams[0].id);
                setShowDecreaseModal(true);
              }}
              className="px-4 py-2 bg-[#DC2626] text-white rounded hover:bg-red-700 transition"
            >
              -1
            </button>
            <button
              onClick={() => {
                setScoringTeamId(activeTeams[0].id);
                setScoreTime(elapsedTime);
                setShowGoalModal(true);
              }}
              className={`px-4 py-2 ${!isClockRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#059669] hover:bg-green-700'} text-white rounded transition`}
              disabled={!isClockRunning}
            >
              +1
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleShotChange('homeTeam', -1)}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded hover:bg-blue-700 transition"
            >
              Shot -
            </button>
            <button
              onClick={() => handleShotChange('homeTeam', 1)}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded hover:bg-blue-700 transition"
            >
              Shot +
            </button>
          </div>
        </div>

        {/* Clock Controls */}
        <div className="space-y-4 text-center">
          <h3 className="text-xl font-bold mb-4">Game Controls</h3>
          <div className="flex justify-center space-x-2 mb-4">
            <button
              onClick={handleClockToggle}
              className={`px-6 py-2 rounded font-bold transition ${isClockRunning ? 'bg-[#DC2626] hover:bg-red-700' : 'bg-[#059669] hover:bg-green-700'}`}
            >
              {isClockRunning ? 'Stop' : 'Start'}
            </button>
          </div>
          <div className="text-sm text-gray-300 mb-4">
            Elapsed Time: {gameState.elapsedTimeString || '00:00'}
          </div>
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => handlePeriodChange(-1)}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded hover:bg-blue-700 transition"
            >
              Period -
            </button>
            <button
              onClick={() => handlePeriodChange(1)}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded hover:bg-blue-700 transition"
            >
              Period +
            </button>
          </div>
          <div className="mt-4">
            <DownloadButton />
          </div>
        </div>

        {/* Away Team Controls */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">{activeTeams[1]?.name || 'Away Team'}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setScoringTeamId(activeTeams[1].id);
                setShowDecreaseModal(true);
              }}
              className="px-4 py-2 bg-[#DC2626] text-white rounded hover:bg-red-700 transition"
            >
              -1
            </button>
            <button
              onClick={() => {
                setScoringTeamId(activeTeams[1].id);
                setScoreTime(elapsedTime);
                setShowGoalModal(true);
              }}
              className={`px-4 py-2 ${!isClockRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#059669] hover:bg-green-700'} text-white rounded transition`}
              disabled={!isClockRunning}
            >
              +1
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleShotChange('awayTeam', -1)}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded hover:bg-blue-700 transition"
            >
              Shot -
            </button>
            <button
              onClick={() => handleShotChange('awayTeam', 1)}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded hover:bg-blue-700 transition"
            >
              Shot +
            </button>
          </div>
        </div>
      </div>
      {showGoalModal && (
        <GoalModal
          isOpen={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          team={teams.find(team => team.id === scoringTeamId)}
          goalTime={goalTime}
          onGoalRecord={(scorerId, assistId, secondAssistId) => {
            recordGoal(scoringTeamId, parseInt(scorerId), parseInt(assistId), parseInt(secondAssistId), scoreTime);
            handleScoreChange(scoringTeamId === activeTeams[0].id ? 'homeTeam' : 'awayTeam', 1);
            setShowGoalModal(false);
          }}
        />
      )}
      {showDecreaseModal && (
        <DecreaseModal
          isOpen={showDecreaseModal}
          onClose={() => setShowDecreaseModal(false)}
          team={teams.find(team => team.id === scoringTeamId)}
          onDecrease={(playerId, statType) => {
            const player = teams.find(team => team.id === scoringTeamId).roster.find(p => p.id === parseInt(playerId));
            if (statType === 'goals' && player.goals > 0) {
              handleScoreChange(scoringTeamId === activeTeams[0].id ? 'homeTeam' : 'awayTeam', -1);
            }
            setShowDecreaseModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminControls;