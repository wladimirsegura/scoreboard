-- Create standings view
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

-- Create scoring leaders view
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