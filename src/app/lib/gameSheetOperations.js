import supabase from './supabase';

export const gameSheetOperations = {
  // Record a game event (goal, shot, penalty, etc.)
  async recordEvent(gameId, teamId, playerId, eventType, period, time, elapsedTime, details = {}) {
    try {
      const { data, error } = await supabase.rpc('record_game_event', {
        p_game_id: gameId,
        p_team_id: teamId,
        p_player_id: playerId,
        p_event_type: eventType,
        p_period: period,
        p_time: time,
        p_elapsed_time: elapsedTime,
        p_details: details
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to record game event:', error);
      throw error;
    }
  },

  // Get all events for a specific game
  async getGameEvents(gameId) {
    try {
      const { data, error } = await supabase
        .from('game_sheets')
        .select(`
          *,
          team:teams(name),
          player:players(name, number)
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch game events:', error);
      throw error;
    }
  },

  // Get game summary
  async getGameSummary(gameId) {
    try {
      const { data, error } = await supabase
        .from('game_sheet_summary')
        .select('*')
        .eq('game_id', gameId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch game summary:', error);
      throw error;
    }
  },

  // Subscribe to game events
  subscribeToGameEvents(gameId, callback) {
    return supabase
      .channel(`game_sheets:${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_sheets',
        filter: `game_id=eq.${gameId}`
      }, callback)
      .subscribe();
  }
};