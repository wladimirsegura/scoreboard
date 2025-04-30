'use client';

import { useState } from 'react';
import { useTeams } from '@/app/context/TeamsContext';
import { useGame } from '@/app/contexts/GameContext';

export default function DecreaseModal({ isOpen, onClose, team, onDecrease }) {
  const { timeline, removeGoal } = useTeams();
  const { handleScoreChange } = useGame();
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!isOpen) return null;

  const teamEvents = timeline.filter(event => event.teamName === team.name);

  const handleSubmit = () => {
    if (selectedEvent) {
      removeGoal(selectedEvent);
      // Update the score in GameStateContext to reflect in the main scoreboard
      handleScoreChange(team.name === 'Home Team' ? 'homeTeam' : 'awayTeam', -1);
      onDecrease(selectedEvent.scorerNumber, 'goals');
      setSelectedEvent(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1F2937] p-6 rounded-lg shadow-xl w-[600px]">
        <h2 className="text-xl font-bold text-white mb-4">Select Goal to Remove</h2>
        
        <div className="space-y-4">
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2">Period</th>
                  <th className="text-left py-2">Scorer</th>
                  <th className="text-left py-2">Assist 1</th>
                  <th className="text-left py-2">Assist 2</th>
                  <th className="text-left py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {teamEvents.map((event, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-700 ${selectedEvent === event ? 'bg-[#374151]' : ''}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <td className="py-2">{event.period}</td>
                    <td className="py-2">#{event.scorerNumber}</td>
                    <td className="py-2">{event.assisterNumber ? `#${event.assisterNumber}` : '-'}</td>
                    <td className="py-2">{event.secondAssisterNumber ? `#${event.secondAssisterNumber}` : '-'}</td>
                    <td className="py-2">
                      <button 
                        className={`px-3 py-1 rounded ${selectedEvent === event ? 'bg-[#DC2626] text-white' : 'bg-gray-600 text-gray-300'}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
                {teamEvents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-2 text-gray-400 italic text-center">No scoring events</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedEvent}
              className="px-4 py-2 bg-[#DC2626] text-white rounded hover:bg-[#B91C1C] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Decrease
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}