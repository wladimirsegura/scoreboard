import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { teamId } = params;

    const { data: players, error } = await supabase
      .from('players')
      .select(`
        id,
        name,
        number,
        position,
        is_active,
        player_stats (
          goals,
          assists,
          points
        )
      `)
      .eq('team_id', teamId)
      .eq('is_active', true);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch team roster' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: players || []
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}