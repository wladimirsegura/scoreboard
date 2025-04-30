revoke delete on table "public"."games" from "anon";

revoke insert on table "public"."games" from "anon";

revoke references on table "public"."games" from "anon";

revoke select on table "public"."games" from "anon";

revoke trigger on table "public"."games" from "anon";

revoke truncate on table "public"."games" from "anon";

revoke update on table "public"."games" from "anon";

revoke delete on table "public"."games" from "authenticated";

revoke insert on table "public"."games" from "authenticated";

revoke references on table "public"."games" from "authenticated";

revoke select on table "public"."games" from "authenticated";

revoke trigger on table "public"."games" from "authenticated";

revoke truncate on table "public"."games" from "authenticated";

revoke update on table "public"."games" from "authenticated";

revoke delete on table "public"."games" from "service_role";

revoke insert on table "public"."games" from "service_role";

revoke references on table "public"."games" from "service_role";

revoke select on table "public"."games" from "service_role";

revoke trigger on table "public"."games" from "service_role";

revoke truncate on table "public"."games" from "service_role";

revoke update on table "public"."games" from "service_role";

revoke delete on table "public"."goals" from "anon";

revoke insert on table "public"."goals" from "anon";

revoke references on table "public"."goals" from "anon";

revoke select on table "public"."goals" from "anon";

revoke trigger on table "public"."goals" from "anon";

revoke truncate on table "public"."goals" from "anon";

revoke update on table "public"."goals" from "anon";

revoke delete on table "public"."goals" from "authenticated";

revoke insert on table "public"."goals" from "authenticated";

revoke references on table "public"."goals" from "authenticated";

revoke select on table "public"."goals" from "authenticated";

revoke trigger on table "public"."goals" from "authenticated";

revoke truncate on table "public"."goals" from "authenticated";

revoke update on table "public"."goals" from "authenticated";

revoke delete on table "public"."goals" from "service_role";

revoke insert on table "public"."goals" from "service_role";

revoke references on table "public"."goals" from "service_role";

revoke select on table "public"."goals" from "service_role";

revoke trigger on table "public"."goals" from "service_role";

revoke truncate on table "public"."goals" from "service_role";

revoke update on table "public"."goals" from "service_role";

revoke delete on table "public"."schedule" from "anon";

revoke insert on table "public"."schedule" from "anon";

revoke references on table "public"."schedule" from "anon";

revoke select on table "public"."schedule" from "anon";

revoke trigger on table "public"."schedule" from "anon";

revoke truncate on table "public"."schedule" from "anon";

revoke update on table "public"."schedule" from "anon";

revoke delete on table "public"."schedule" from "authenticated";

revoke insert on table "public"."schedule" from "authenticated";

revoke references on table "public"."schedule" from "authenticated";

revoke select on table "public"."schedule" from "authenticated";

revoke trigger on table "public"."schedule" from "authenticated";

revoke truncate on table "public"."schedule" from "authenticated";

revoke update on table "public"."schedule" from "authenticated";

revoke delete on table "public"."schedule" from "service_role";

revoke insert on table "public"."schedule" from "service_role";

revoke references on table "public"."schedule" from "service_role";

revoke select on table "public"."schedule" from "service_role";

revoke trigger on table "public"."schedule" from "service_role";

revoke truncate on table "public"."schedule" from "service_role";

revoke update on table "public"."schedule" from "service_role";

alter table "public"."games" drop constraint "games_away_team_id_fkey";

alter table "public"."games" drop constraint "games_home_team_id_fkey";

alter table "public"."games" drop constraint "games_schedule_id_fkey";

alter table "public"."games" drop constraint "games_status_check";

alter table "public"."games" drop constraint "games_winner_id_fkey";

alter table "public"."goals" drop constraint "goals_assist1_id_fkey";

alter table "public"."goals" drop constraint "goals_assist2_id_fkey";

alter table "public"."goals" drop constraint "goals_game_id_fkey";

alter table "public"."goals" drop constraint "goals_scorer_id_fkey";

alter table "public"."goals" drop constraint "goals_team_id_fkey";

alter table "public"."schedule" drop constraint "schedule_away_team_id_fkey";

alter table "public"."schedule" drop constraint "schedule_home_team_id_fkey";

alter table "public"."schedule" drop constraint "schedule_season_id_fkey";

alter table "public"."schedule" drop constraint "schedule_status_check";

alter table "public"."games" drop constraint "games_pkey";

alter table "public"."goals" drop constraint "goals_pkey";

alter table "public"."schedule" drop constraint "schedule_pkey";

drop index if exists "public"."games_pkey";

drop index if exists "public"."goals_pkey";

drop index if exists "public"."schedule_pkey";

drop table "public"."games";

drop table "public"."goals";

drop table "public"."schedule";

alter table "public"."player_stats" enable row level security;

alter table "public"."players" enable row level security;

alter table "public"."seasons" enable row level security;

alter table "public"."team_stats" enable row level security;

alter table "public"."teams" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_player_stats_after_goal()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_team_stats_after_game()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

create policy "Allow authenticated update"
on "public"."player_stats"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated write"
on "public"."player_stats"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Allow public read access"
on "public"."player_stats"
as permissive
for select
to public
using (true);


create policy "Allow authenticated update"
on "public"."players"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated write"
on "public"."players"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Allow public read access"
on "public"."players"
as permissive
for select
to public
using (true);


create policy "Allow authenticated update"
on "public"."seasons"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated write"
on "public"."seasons"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Allow public read access"
on "public"."seasons"
as permissive
for select
to public
using (true);


create policy "Allow authenticated update"
on "public"."team_stats"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated write"
on "public"."team_stats"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Allow public read access"
on "public"."team_stats"
as permissive
for select
to public
using (true);


create policy "Allow authenticated update"
on "public"."teams"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated write"
on "public"."teams"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Allow public read access"
on "public"."teams"
as permissive
for select
to public
using (true);



