-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create game_sheets table
CREATE TABLE game_sheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id),
  player_id UUID REFERENCES players(id),
  event_type TEXT NOT NULL,
  period INTEGER NOT NULL,
  time TEXT NOT NULL,
  elapsed_time TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (event_type IN ('goal', 'shot', 'penalty', 'timeout', 'goalie_change', 'period_start', 'period_end', 'game_start', 'game_end')),
  CHECK (period >= 1 AND period <= 4)
);

-- Create index for faster queries
CREATE INDEX idx_game_sheets_game_id ON game_sheets(game_id);
CREATE INDEX idx_game_sheets_team_id ON game_sheets(team_id);
CREATE INDEX idx_game_sheets_player_id ON game_sheets(player_id);

-- Create view for game sheet summary
CREATE VIEW game_sheet_summary AS
SELECT 
  gs.game_id,
  g.home_team_id,
  g.away_team_id,
  g.home_score,
  g.away_score,
  g.period,
  g.status,
  COUNT(CASE WHEN gs.event_type = 'goal' THEN 1 END) as total_goals,
  COUNT(CASE WHEN gs.event_type = 'shot' THEN 1 END) as total_shots,
  COUNT(CASE WHEN gs.event_type = 'penalty' THEN 1 END) as total_penalties
FROM game_sheets gs
JOIN games g ON gs.game_id = g.id
GROUP BY 
  gs.game_id,
  g.home_team_id,
  g.away_team_id,
  g.home_score,
  g.away_score,
  g.period,
  g.status;

-- Create function to record game events
CREATE OR REPLACE FUNCTION record_game_event(
  p_game_id UUID,
  p_team_id UUID,
  p_player_id UUID,
  p_event_type TEXT,
  p_period INTEGER,
  p_time TEXT,
  p_elapsed_time TEXT,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO game_sheets (
    game_id,
    team_id,
    player_id,
    event_type,
    period,
    time,
    elapsed_time,
    details
  ) VALUES (
    p_game_id,
    p_team_id,
    p_player_id,
    p_event_type,
    p_period,
    p_time,
    p_elapsed_time,
    p_details
  ) RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;