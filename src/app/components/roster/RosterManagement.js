'use client';

import { useTeams } from '../../context/TeamsContext';

const RosterManagement = () => {
  const { teams, addPlayer, updatePlayer, removePlayer } = useTeams();

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 rounded-lg bg-[#1F2937] text-[#F3F4F6] border border-[#1E3A8A] shadow-lg">
      {teams.map(team => (
        <div key={team.id} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{team.name} Roster</h3>
            <button
              onClick={() => addPlayer(team.id)}
              className="px-4 py-2 bg-[#059669] text-white rounded hover:bg-green-700 transition"
            >
              Add Player
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-[#374151]">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Position</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.roster.map(player => (
                  <tr key={player.id} className="border-b border-[#374151]">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={player.number}
                        onChange={(e) => updatePlayer(team.id, player.id, 'number', e.target.value)}
                        className="w-16 bg-[#374151] rounded px-2 py-1"
                        placeholder="#"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayer(team.id, player.id, 'name', e.target.value)}
                        className="w-full bg-[#374151] rounded px-2 py-1"
                        placeholder="Player Name"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={player.position}
                        onChange={(e) => updatePlayer(team.id, player.id, 'position', e.target.value)}
                        className="w-full bg-[#374151] rounded px-2 py-1"
                        placeholder="Position"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removePlayer(team.id, player.id)}
                        className="px-3 py-1 bg-[#DC2626] text-white rounded hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RosterManagement;