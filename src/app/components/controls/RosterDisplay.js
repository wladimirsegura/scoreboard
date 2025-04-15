'use client';
import { useState } from 'react';

export default function RosterDisplay({ roster, teamId, onUpdatePlayer, onRemovePlayer, onAddPlayer }) {
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Team Roster</h3>
        <button
          onClick={() => onAddPlayer(teamId)}
          className="px-4 py-2 bg-[#DC2626] text-white rounded hover:bg-[#B91C1C] transition-colors"
        >
          Add Player
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#1F2937] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#374151]">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">POS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">G</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">A</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#374151]">
            {roster.map(player => (
              <tr key={player.id}>
                <td className="px-6 py-4">
                  {editingPlayerId === player.id ? (
                    <input
                      type="text"
                      value={player.number}
                      onChange={(e) => onUpdatePlayer(teamId, player.id, 'number', e.target.value)}
                      className="w-16 px-2 py-1 bg-[#374151] border border-[#1E3A8A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    />
                  ) : (
                    <span className="text-white">{player.number}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingPlayerId === player.id ? (
                    <select
                      value={player.position}
                      onChange={(e) => onUpdatePlayer(teamId, player.id, 'position', e.target.value)}
                      className="w-24 px-2 py-1 bg-[#374151] border border-[#1E3A8A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="C">C</option>
                      <option value="FW">FW</option>
                      <option value="DF">DF</option>
                      <option value="GK">GK</option>
                      <option value="HP">HP</option>
                    </select>
                  ) : (
                    <span className="text-white">{player.position}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingPlayerId === player.id ? (
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => onUpdatePlayer(teamId, player.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 bg-[#374151] border border-[#1E3A8A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                    />
                  ) : (
                    <span className="text-white">{player.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-white">{player.goals}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-white">{player.assists}</span>
                </td>
                <td className="px-2 py-4 text-right flex items-center justify-end space-x-1">
                  <button
                    onClick={() => setEditingPlayerId(editingPlayerId === player.id ? null : player.id)}
                    className="p-1 text-blue-500 hover:text-blue-400 transition-colors rounded-full hover:bg-[#374151]"
                    title={editingPlayerId === player.id ? "Save" : "Edit"}
                  >
                    {editingPlayerId === player.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${player.name} (#${player.number}) from the roster?`)) {
                        onRemovePlayer(teamId, player.id);
                      }
                    }}
                    className="p-1 text-[#DC2626] hover:text-[#B91C1C] transition-colors rounded-full hover:bg-[#374151]"
                    title="Remove Player"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}