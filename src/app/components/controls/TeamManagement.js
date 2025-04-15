'use client';

import { useTeams } from '../../context/TeamsContext';
import RosterDisplay from './RosterDisplay';

export default function TeamManagement() {
  const { getActiveTeams, updateTeamName, addPlayer, updatePlayer, removePlayer } = useTeams();

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Team Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getActiveTeams().map(team => (
          <div key={team.id} className="bg-[#1F2937] p-6 rounded-lg shadow-lg">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Team Name
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeamName(team.id, e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-[#374151] border border-[#1E3A8A] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
                  placeholder="Enter team name"
                />
              </label>
              <div className="flex justify-between items-center text-gray-300">
                <span>Score: {team.score}</span>
                <span>Shots: {team.shots}</span>
              </div>
              <RosterDisplay
                roster={team.roster}
                teamId={team.id}
                onUpdatePlayer={updatePlayer}
                onRemovePlayer={removePlayer}
                onAddPlayer={addPlayer}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}