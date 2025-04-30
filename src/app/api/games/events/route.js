import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

// POST /api/games/events
export async function POST(request) {
  try {
    const body = await request.json();
    const { gameId, teamId, eventType, scorerId, primaryAssistId, secondaryAssistId, period, timeElapsed } = body;

    if (!gameId || !teamId || !eventType) {
      return NextResponse.json(
        { error: 'Game ID, team ID, and event type are required' },
        { status: 400 }
      );
    }

    // Create the game event
    const { data: event, error: eventError } = await supabase
      .from('game_events')
      .insert([
        {
          game_id: gameId,
          team_id: teamId,
          event_type: eventType,
          scorer_id: scorerId,
          primary_assist_id: primaryAssistId,
          secondary_assist_id: secondaryAssistId,
          period,
          time_elapsed: timeElapsed
        }
      ])
      .select()
      .single();

    if (eventError) {
      console.error('Database error:', eventError);
      return NextResponse.json(
        { error: 'Failed to create game event' },
        { status: 500 }
      );
    }

    // If it's a goal, update the game score
    if (eventType === 'goal') {
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select('home_team_id, away_team_id, home_score, away_score')
        .eq('id', gameId)
        .single();

      if (gameError) {
        console.error('Database error:', gameError);
        return NextResponse.json(
          { error: 'Failed to fetch game data' },
          { status: 500 }
        );
      }

      const isHomeTeam = game.home_team_id === teamId;
      const updates = isHomeTeam
        ? { home_score: game.home_score + 1 }
        : { away_score: game.away_score + 1 };

      const { error: updateError } = await supabase
        .from('games')
        .update(updates)
        .eq('id', gameId);

      if (updateError) {
        console.error('Database error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update game score' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/games/events/:id
export async function DELETE(request) {
  try {
    const eventId = request.nextUrl.searchParams.get('id');
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Get the event details before deletion
    const { data: event, error: fetchError } = await supabase
      .from('game_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (fetchError) {
      console.error('Database error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch event' },
        { status: 500 }
      );
    }

    // Delete the event
    const { error: deleteError } = await supabase
      .from('game_events')
      .delete()
      .eq('id', eventId);

    if (deleteError) {
      console.error('Database error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      );
    }

    // If it was a goal, update the game score
    if (event.event_type === 'goal') {
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select('home_team_id, away_team_id, home_score, away_score')
        .eq('id', event.game_id)
        .single();

      if (gameError) {
        console.error('Database error:', gameError);
        return NextResponse.json(
          { error: 'Failed to fetch game data' },
          { status: 500 }
        );
      }

      const isHomeTeam = game.home_team_id === event.team_id;
      const updates = isHomeTeam
        ? { home_score: Math.max(0, game.home_score - 1) }
        : { away_score: Math.max(0, game.away_score - 1) };

      const { error: updateError } = await supabase
        .from('games')
        .update(updates)
        .eq('id', event.game_id);

      if (updateError) {
        console.error('Database error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update game score' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}