-- Seasons table
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table (enhanced)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  abbreviation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table (enhanced)
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  number TEXT,
  name TEXT NOT NULL,
  position TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedule table
CREATE TABLE schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES teams(id),
  away_team_id UUID REFERENCES teams(id),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table (enhanced)
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES schedule(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES teams(id),
  away_team_id UUID REFERENCES teams(id),
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  home_shots INTEGER DEFAULT 0,
  away_shots INTEGER DEFAULT 0,
  period INTEGER DEFAULT 1,
  clock TEXT DEFAULT '8:00',
  status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed
  winner_id UUID REFERENCES teams(id),
 game_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table (enhanced)
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id),
  scorer_id UUID REFERENCES players(id),
  assist1_id UUID REFERENCES players(id),
  assist2_id UUID REFERENCES players(id),
  period INTEGER NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Season team stats (for quick access to standings)
-- Modify team_stats table to remove overtime_losses column since it's not needed
CREATE TABLE team_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  games_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  ties INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(season_id, team_id)
);

-- Season player stats
CREATE TABLE player_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id),
  games_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(season_id, player_id)
);

-- Set up RLS policies
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Create policies (allow read for all, write for authenticated users)
CREATE POLICY "Allow public read access" ON seasons FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON schedule FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON games FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON goals FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON team_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON player_stats FOR SELECT USING (true);

-- Create write policies for authenticated users
CREATE POLICY "Allow authenticated write" ON seasons FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write" ON teams FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write" ON players FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write" ON schedule FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write" ON games FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write" ON goals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write" ON team_stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated write" ON player_stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create update policies
CREATE POLICY "Allow authenticated update" ON seasons FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON teams FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON players FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON schedule FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON games FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON goals FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON team_stats FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON player_stats FOR UPDATE USING (auth.role() = 'authenticated');

-- Create some useful views
CREATE VIEW standings AS
SELECT 
  s.name AS season_name,
  t.name AS team_name,
  ts.games_played,
  ts.wins,
  ts.losses,
  ts.ties,
  ts.points,
  ts.goals_for,
  ts.goals_against,
  (ts.goals_for - ts.goals_against) AS goal_differential
FROM team_stats ts
JOIN teams t ON ts.team_id = t.id
JOIN seasons s ON ts.season_id = s.id
ORDER BY ts.points DESC, goal_differential DESC;

CREATE VIEW scoring_leaders AS
SELECT 
  s.name AS season_name,
  p.name AS player_name,
  t.name AS team_name,
  ps.games_played,
  ps.goals,
  ps.assists,
  ps.points
FROM player_stats ps
JOIN players p ON ps.player_id = p.id
JOIN teams t ON ps.team_id = t.id
JOIN seasons s ON ps.season_id = s.id
ORDER BY ps.points DESC, ps.goals DESC;

-- Function to update team stats after game completion
-- Update the function for the new point system (win: 3, tie: 1, loss: 0)
CREATE OR REPLACE FUNCTION update_team_stats_after_game()
RETURNS TRIGGER AS $$
DECLARE
  v_season_id UUID;
  v_winner_id UUID;
  v_loser_id UUID;
  v_is_tie BOOLEAN;
BEGIN
  -- Get season ID from schedule
  SELECT season_id INTO v_season_id FROM schedule WHERE id = NEW.schedule_id;
  
  -- Determine winner and loser
  IF NEW.home_score > NEW.away_score THEN
    v_winner_id := NEW.home_team_id;
    v_loser_id := NEW.away_team_id;
    v_is_tie := FALSE;
  ELSIF NEW.away_score > NEW.home_score THEN
    v_winner_id := NEW.away_team_id;
    v_loser_id := NEW.home_team_id;
    v_is_tie := FALSE;
  ELSE
    v_is_tie := TRUE;
  END IF;
  
  -- Update home team stats
  INSERT INTO team_stats (season_id, team_id, games_played, wins, losses, ties, points, goals_for, goals_against)
  VALUES (
    v_season_id, 
    NEW.home_team_id, 
    1,
    CASE WHEN NEW.home_team_id = v_winner_id THEN 1 ELSE 0 END,
    CASE WHEN NEW.home_team_id = v_loser_id THEN 1 ELSE 0 END,
    CASE WHEN v_is_tie THEN 1 ELSE 0 END,
    CASE 
      WHEN NEW.home_team_id = v_winner_id THEN 3
      WHEN v_is_tie THEN 1
      ELSE 0
    END,
    NEW.home_score,
    NEW.away_score
  )
  ON CONFLICT (season_id, team_id) DO UPDATE
  SET 
    games_played = team_stats.games_played + 1,
    wins = team_stats.wins + CASE WHEN NEW.home_team_id = v_winner_id THEN 1 ELSE 0 END,
    losses = team_stats.losses + CASE WHEN NEW.home_team_id = v_loser_id THEN 1 ELSE 0 END,
    ties = team_stats.ties + CASE WHEN v_is_tie THEN 1 ELSE 0 END,
    points = team_stats.points + CASE 
      WHEN NEW.home_team_id = v_winner_id THEN 3
      WHEN v_is_tie THEN 1
      ELSE 0
    END,
    goals_for = team_stats.goals_for + NEW.home_score,
    goals_against = team_stats.goals_against + NEW.away_score;
    
  -- Update away team stats
  INSERT INTO team_stats (season_id, team_id, games_played, wins, losses, ties, points, goals_for, goals_against)
  VALUES (
    v_season_id, 
    NEW.away_team_id, 
    1,
    CASE WHEN NEW.away_team_id = v_winner_id THEN 1 ELSE 0 END,
    CASE WHEN NEW.away_team_id = v_loser_id THEN 1 ELSE 0 END,
    CASE WHEN v_is_tie THEN 1 ELSE 0 END,
    CASE 
      WHEN NEW.away_team_id = v_winner_id THEN 3
      WHEN v_is_tie THEN 1
      ELSE 0
    END,
    NEW.away_score,
    NEW.home_score
  )
  ON CONFLICT (season_id, team_id) DO UPDATE
  SET 
    games_played = team_stats.games_played + 1,
    wins = team_stats.wins + CASE WHEN NEW.away_team_id = v_winner_id THEN 1 ELSE 0 END,
    losses = team_stats.losses + CASE WHEN NEW.away_team_id = v_loser_id THEN 1 ELSE 0 END,
    ties = team_stats.ties + CASE WHEN v_is_tie THEN 1 ELSE 0 END,
    points = team_stats.points + CASE 
      WHEN NEW.away_team_id = v_winner_id THEN 3
      WHEN v_is_tie THEN 1
      ELSE 0
    END,
    goals_for = team_stats.goals_for + NEW.away_score,
    goals_against = team_stats.goals_against + NEW.home_score;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update team stats after game completion
CREATE TRIGGER update_team_stats_after_game_trigger
AFTER UPDATE OF status ON games
FOR EACH ROW
WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
EXECUTE FUNCTION update_team_stats_after_game();

-- Function to update player stats when a goal is recorded
CREATE OR REPLACE FUNCTION update_player_stats_after_goal()
RETURNS TRIGGER AS $$
DECLARE
  v_season_id UUID;
  v_game record;
BEGIN
  -- Get game info
  SELECT * INTO v_game FROM games WHERE id = NEW.game_id;
  
  -- Get season ID from schedule
  SELECT season_id INTO v_season_id FROM schedule WHERE id = v_game.schedule_id;
  
  -- Update scorer stats
  IF NEW.scorer_id IS NOT NULL THEN
    INSERT INTO player_stats (season_id, player_id, team_id, goals)
    VALUES (v_season_id, NEW.scorer_id, NEW.team_id, 1)
    ON CONFLICT (season_id, player_id) DO UPDATE
    SET goals = player_stats.goals + 1,
        points = player_stats.goals + player_stats.assists;
  END IF;
  
  -- Update primary assist stats
  IF NEW.assist1_id IS NOT NULL THEN
    INSERT INTO player_stats (season_id, player_id, team_id, assists)
    VALUES (v_season_id, NEW.assist1_id, NEW.team_id, 1)
    ON CONFLICT (season_id, player_id) DO UPDATE
    SET assists = player_stats.assists + 1,
        points = player_stats.goals + player_stats.assists;
  END IF;
  
  -- Update secondary assist stats
  IF NEW.assist2_id IS NOT NULL THEN
    INSERT INTO player_stats (season_id, player_id, team_id, assists)
    VALUES (v_season_id, NEW.assist2_id, NEW.team_id, 1)
    ON CONFLICT (season_id, player_id) DO UPDATE
    SET assists = player_stats.assists + 1,
        points = player_stats.goals + player_stats.assists;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for the player stats update function
CREATE TRIGGER update_player_stats_after_goal_trigger
AFTER INSERT ON goals
FOR EACH ROW
EXECUTE FUNCTION update_player_stats_after_goal();