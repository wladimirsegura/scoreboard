'use client';

import { useState } from 'react';
import { useTeams } from '../context/TeamsContext';

export default function TeamSelectionModal({ isOpen, onClose }) {
  const { teams } = useTeams();
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [error, setError] = useState('');

  const handleTeamSelect = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
      setError('');
    } else if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, teamId]);
      setError('');
    } else {
      setError('You can only select two teams');
    }
  };

  const handleConfirm = () => {
    if (selectedTeams.length !== 2) {
      setError('Please select exactly two teams');
      return;
    }
    onClose(selectedTeams);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">Select Teams</h2>
        <p className="text-gray-300 mb-4">Please select two teams to start the game:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team.id)}
              className={`p-4 rounded-md border-2 ${
                selectedTeams.includes(team.id)
                  ? 'border-blue-500 bg-blue-900'
                  : 'border-gray-600 hover:border-gray-400'
              } transition-colors duration-200`}
            >
              <h3 className="text-xl font-semibold text-white">{team.name}</h3>
              <p className="text-gray-400 text-sm mt-2">{team.roster.length} Players</p>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={handleConfirm}
            className={`px-6 py-2 rounded-lg ${
              selectedTeams.length === 2
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-600 cursor-not-allowed'
            } text-white transition-colors duration-200`}
            disabled={selectedTeams.length !== 2}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}