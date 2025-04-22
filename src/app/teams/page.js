'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/utils/supabase';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          logo_url,
          abbreviation,
          players (id, name, number, position, is_active, player_stats (goals, assists, points))
        `)
        .eq('players.is_active', true);

      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      setError('Failed to fetch teams');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading teams...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-[#1F2937] min-h-screen text-[#F3F4F6]">
      <h1 className="text-2xl font-bold mb-6 text-[#F3F4F6]">Teams</h1>
      <div className="space-y-8">
        {teams.map(team => (
          <div key={team.id} className="bg-[#1F2937] rounded-lg shadow-md p-6 border border-[#1E3A8A]">
            <div className="flex items-center gap-4 mb-4">
              {team.logo_url && (
                <img 
                  src={team.logo_url} 
                  alt={`${team.name} logo`} 
                  className="w-16 h-16 object-contain"
                />
              )}
              <h2 className="text-xl font-semibold text-[#F3F4F6]">{team.name}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#374151] border-b border-[#1E3A8A]">
                    <th className="px-4 py-2 text-left text-[#F3F4F6]">#</th>
                    <th className="px-4 py-2 text-left text-[#F3F4F6]">Name</th>
                    <th className="px-4 py-2 text-left text-[#F3F4F6]">Position</th>
                    <th className="px-4 py-2 text-center text-[#F3F4F6]">Goals</th>
                    <th className="px-4 py-2 text-center text-[#F3F4F6]">Assists</th>
                    <th className="px-4 py-2 text-center text-[#F3F4F6]">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players?.map(player => (
                    <tr key={player.id} className="border-t border-[#1E3A8A] hover:bg-[#374151] transition-colors">
                      <td className="px-4 py-2 text-[#F3F4F6]">{player.number}</td>
                      <td className="px-4 py-2 text-[#F3F4F6]">{player.name}</td>
                      <td className="px-4 py-2 text-[#F3F4F6]">{player.position}</td>
                      <td className="px-4 py-2 text-center text-[#F3F4F6]">{player.player_stats?.[0]?.goals || 0}</td>
                      <td className="px-4 py-2 text-center text-[#F3F4F6]">{player.player_stats?.[0]?.assists || 0}</td>
                      <td className="px-4 py-2 text-center text-[#F3F4F6]">{player.player_stats?.[0]?.points || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}