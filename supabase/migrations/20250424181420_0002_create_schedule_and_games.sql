-- Create schedule table
CREATE TABLE schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES teams(id),
  away_team_id UUID REFERENCES teams(id),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled'))
);

-- Create games table
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
  status TEXT DEFAULT 'scheduled',
  winner_id UUID REFERENCES teams(id),
  game_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (status IN ('scheduled', 'in_progress', 'completed'))
);