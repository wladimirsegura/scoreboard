'use client';

import { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

export default function GoalModal({ isOpen, onClose, team, onGoalRecord, goalTime }) {
  const { gameState } = useGameState();
  const [selectedScorer, setSelectedScorer] = useState('');
  const [selectedAssist, setSelectedAssist] = useState('');
  const [selectedSecondAssist, setSelectedSecondAssist] = useState('');
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedScorer) {
      alert('Please select a goal scorer.');
      return;
    }
    onGoalRecord(selectedScorer, selectedAssist, selectedSecondAssist);
    setSelectedScorer('');
    setSelectedAssist('');
    setSelectedSecondAssist('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1F2937] p-8 rounded-lg shadow-xl w-[32rem]">
        <h2 className="text-4xl font-bold text-white mb-6">Record Goal</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-3">
              Goal Scorer
            </label>
            <select
              value={selectedScorer}
              onChange={(e) => setSelectedScorer(e.target.value)}
              className="w-full px-4 py-3 bg-[#374151] border border-[#1E3A8A] rounded-md text-white text-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
            >
              <option value="">Select Player</option>
              {team.roster.map(player => (
                <option key={player.id} value={player.id}>
                  {player.number} - {player.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-3">
              Assist (Optional)
            </label>
            <select
              value={selectedAssist}
              onChange={(e) => setSelectedAssist(e.target.value)}
              className="w-full px-4 py-3 bg-[#374151] border border-[#1E3A8A] rounded-md text-white text-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
            >
              <option value="">Select Player</option>
              {team.roster
                .filter(player => player.id !== parseInt(selectedScorer))
                .map(player => (
                  <option key={player.id} value={player.id}>
                    {player.number} - {player.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-3">
              Second Assist (Optional)
            </label>
            <select
              value={selectedSecondAssist}
              onChange={(e) => setSelectedSecondAssist(e.target.value)}
              className="w-full px-4 py-3 bg-[#374151] border border-[#1E3A8A] rounded-md text-white text-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
            >
              <option value="">Select Player</option>
              {team.roster
                .filter(player => player.id !== parseInt(selectedScorer) && player.id !== parseInt(selectedAssist))
                .map(player => (
                  <option key={player.id} value={player.id}>
                    {player.number} - {player.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 text-white text-xl rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedScorer}
              className={`px-6 py-3 ${!selectedScorer ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#DC2626] hover:bg-red-700'} text-white text-xl rounded transition`}
            >
              Record Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}