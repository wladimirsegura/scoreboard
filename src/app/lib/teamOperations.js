'use client';

import supabase from './supabase';

export const teamOperations = {
  getTeamById: async (teamId) => {
    const { data, error } = await supabase
      .from('teams')
      .select('id, name')
      .eq('id', teamId)
      .single();

    if (error) throw error;
    return data;
  },

  getTeamRoster: async (teamId) => {
    const { data, error } = await supabase
      .from('players')
      .select('id, name, number')
      .eq('team_id', teamId);

    if (error) throw error;
    return data;
  },

  updateTeamStats: async (teamId, updates) => {
    const { data, error } = await supabase
      .from('team_stats')
      .upsert({
        team_id: teamId,
        ...updates
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};