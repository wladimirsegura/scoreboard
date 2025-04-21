import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

export async function GET() {
  try {
    const { data: teams, error } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        logo_url,
        abbreviation,
        players (
          id,
          number,
          name,
          position,
          is_active,
          player_stats (
            goals,
            assists,
            points
          )
        )
      `)
      .eq('players.is_active', true);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch teams' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teams || []
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}