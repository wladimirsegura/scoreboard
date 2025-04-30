import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Game-related database operations
export const gameOperations = {
  createGame: async (homeTeamName, awayTeamName) => {
    // First, get the team IDs from names
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name')
      .in('name', [homeTeamName, awayTeamName]);

    if (teamsError) throw teamsError;
    if (!teams || teams.length !== 2) {
      throw new Error('One or both teams not found');
    }

    const homeTeam = teams.find(team => team.name === homeTeamName);
    const awayTeam = teams.find(team => team.name === awayTeamName);

    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateGameState: async (gameId, updates) => {
    const { data, error } = await supabase
      .from('games')
      .update(updates)
      .eq('id', gameId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  recordGoal: async (gameId, teamId, scorerId, primaryAssistId = null, secondaryAssistId = null) => {
    const { data, error } = await supabase
      .from('game_events')
      .insert([
        {
          game_id: gameId,
          team_id: teamId,
          event_type: 'goal',
          scorer_id: scorerId,
          primary_assist_id: primaryAssistId,
          secondary_assist_id: secondaryAssistId
        }
      ])
      .select();

    if (error) throw error;
    return data;
  },

  subscribeToGame: (gameId, callback) => {
    return supabase
      .channel(`game:${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      }, callback)
      .subscribe();
  }
};

export default supabase;