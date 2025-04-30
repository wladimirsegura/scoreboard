import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

// GET /api/games/:id
export async function GET(request) {
  console.log('[GET /api/games] Request received');
  try {
    const gameId = request.nextUrl.searchParams.get('id');
    console.log('[GET /api/games] Game ID:', gameId);
    
    if (!gameId) {
      console.log('[GET /api/games] Error: Game ID missing');
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID format. Game ID must be a valid UUID' },
        { status: 400 }
      );
    }

    console.log('[GET /api/games] Fetching game from database...');
    const { data: game, error } = await supabase
      .from('games')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*),
        game_events(*, team:teams(*))
      `)
      .eq('id', gameId)
      .single();

    if (error) {
      console.error('[GET /api/games] Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
    }
    console.log('[GET /api/games] Game fetched successfully:', game);

    return NextResponse.json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/games
export async function POST(request) {
  console.log('[POST /api/games] Request received');
  try {
    let body;
    try {
      body = await request.json();
      console.log('[POST /api/games] Request body:', body);
    } catch (parseError) {
      console.log('[POST /api/games] Error: Invalid JSON body');
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { homeTeamName, awayTeamName } = body;

    if (!homeTeamName || !awayTeamName) {
      return NextResponse.json(
        { error: 'Both home team and away team names are required' },
        { status: 400 }
      );
    }

    // Prevent selecting the same team for both home and away
    if (homeTeamName === awayTeamName) {
      return NextResponse.json(
        { error: 'Home team and away team must be different' },
        { status: 400 }
      );
    }

    // Verify both teams exist and get their details
    console.log('[POST /api/games] Verifying teams existence...');
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name')
      .in('name', [homeTeamName, awayTeamName]);

    if (teamsError) {
      console.error('[POST /api/games] Database error:', teamsError);
      return NextResponse.json(
        { error: 'Failed to verify teams' },
        { status: 500 }
      );
    }
    console.log('[POST /api/games] Teams verification result:', teams);

    if (!teams || teams.length !== 2) {
      const missingTeams = [homeTeamName, awayTeamName].filter(
        name => !teams?.some(team => team.name === name)
      );
      return NextResponse.json(
        { 
          error: 'One or both teams do not exist',
          details: `Missing teams with names: ${missingTeams.join(', ')}`
        },
        { status: 400 }
      );
    }

    const homeTeam = teams.find(team => team.name === homeTeamName);
    const awayTeam = teams.find(team => team.name === awayTeamName);

    // Check if there's already an in-progress game for either team
    console.log('[POST /api/games] Checking for existing games...');
    const { data: existingGames, error: existingGamesError } = await supabase
      .from('games')
      .select('id, home_team_id, away_team_id')
      .in('status', ['in_progress'])
      .or(`home_team_id.eq.${homeTeam.id},away_team_id.eq.${homeTeam.id},home_team_id.eq.${awayTeam.id},away_team_id.eq.${awayTeam.id}`);

    if (existingGamesError) {
      console.error('[POST /api/games] Database error:', existingGamesError);
      return NextResponse.json(
        { error: 'Failed to check existing games' },
        { status: 500 }
      );
    }
    console.log('[POST /api/games] Existing games check result:', existingGames);

    if (existingGames && existingGames.length > 0) {
      const busyTeams = teams.filter(team => 
        existingGames.some(game => 
          game.home_team_id === team.id || game.away_team_id === team.id
        )
      );
      return NextResponse.json(
        { 
          error: 'One or both teams are already in an active game',
          details: `Teams already in game: ${busyTeams.map(team => team.name).join(', ')}`
        },
        { status: 400 }
      );
    }

    console.log('[POST /api/games] Creating new game...');
    const gameData = {
      home_team_id: homeTeam.id,
      away_team_id: awayTeam.id,
      status: 'in_progress',
      home_score: 0,
      away_score: 0,
      period: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    console.log('[POST /api/games] Game data:', gameData);

    const { data: game, error } = await supabase
      .from('games')
      .insert([gameData])
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*)
      `)
      .single();

    if (error) {
      console.error('[POST /api/games] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create game' },
        { status: 500 }
      );
    }
    console.log('[POST /api/games] Game created successfully:', game);

    return NextResponse.json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH /api/games/:id
export async function PATCH(request) {
  console.log('[PATCH /api/games] Request received');
  try {
    const gameId = request.nextUrl.searchParams.get('id');
    console.log('[PATCH /api/games] Game ID:', gameId);
    let body;
    try {
      body = await request.json();
      console.log('[PATCH /api/games] Request body:', body);
    } catch (parseError) {
      console.log('[PATCH /api/games] Error: Invalid JSON body');
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID format. Game ID must be a valid UUID' },
        { status: 400 }
      );
    }

    // Validate the update data
    console.log('[PATCH /api/games] Processing update data...');
    const allowedFields = ['status', 'home_score', 'away_score', 'period'];
    const updateData = {};
    
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key];
      }
    });
    console.log('[PATCH /api/games] Update data after validation:', updateData);

    if (Object.keys(updateData).length === 0) {
      console.log('[PATCH /api/games] Error: No valid fields to update');
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data: game, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', gameId)
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*)
      `)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update game' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}