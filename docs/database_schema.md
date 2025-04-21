# Ice Hockey League Management Database Schema

## Overview
This document outlines the database schema for the ice hockey league management system. The schema is designed to track team statistics, player performance, league schedules, and game results.

## Core Tables

### Seasons
- `id` (UUID, Primary Key)
- `name` (Text)
- `start_date` (Date)
- `end_date` (Date)
- `is_active` (Boolean)
- `created_at` (Timestamp)

### Teams
- `id` (UUID, Primary Key)
- `name` (Text)
- `logo_url` (Text)
- `abbreviation` (Text)
- `created_at` (Timestamp)

### Players
- `id` (UUID, Primary Key)
- `team_id` (UUID, Foreign Key to Teams)
- `number` (Text)
- `name` (Text)
- `position` (Text)
- `photo_url` (Text)
- `is_active` (Boolean)
- `created_at` (Timestamp)

## Schedule and Games

### Schedule
- `id` (UUID, Primary Key)
- `season_id` (UUID, Foreign Key to Seasons)
- `home_team_id` (UUID, Foreign Key to Teams)
- `away_team_id` (UUID, Foreign Key to Teams)
- `scheduled_date` (Timestamp)
- `venue` (Text)
- `status` (Text: scheduled, in_progress, completed, cancelled)
- `created_at` (Timestamp)

### Games
- `id` (UUID, Primary Key)
- `schedule_id` (UUID, Foreign Key to Schedule)
- `home_team_id` (UUID, Foreign Key to Teams)
- `away_team_id` (UUID, Foreign Key to Teams)
- `home_score` (Integer)
- `away_score` (Integer)
- `home_shots` (Integer)
- `away_shots` (Integer)
- `period` (Integer)
- `clock` (Text)
- `status` (Text: scheduled, in_progress, completed)
- `winner_id` (UUID, Foreign Key to Teams)
- `game_date` (Timestamp)

## Statistics

### Goals
- `id` (UUID, Primary Key)
- `game_id` (UUID, Foreign Key to Games)
- `team_id` (UUID, Foreign Key to Teams)
- `scorer_id` (UUID, Foreign Key to Players)
- `assist1_id` (UUID, Foreign Key to Players)
- `assist2_id` (UUID, Foreign Key to Players)
- `period` (Integer)
- `time` (Text)
- `created_at` (Timestamp)

### Team Stats
- `id` (UUID, Primary Key)
- `season_id` (UUID, Foreign Key to Seasons)
- `team_id` (UUID, Foreign Key to Teams)
- `games_played` (Integer)
- `wins` (Integer)
- `losses` (Integer)
- `ties` (Integer)
- `points` (Integer)
- `goals_for` (Integer)
- `goals_against` (Integer)
- `created_at` (Timestamp)

### Player Stats
- `id` (UUID, Primary Key)
- `season_id` (UUID, Foreign Key to Seasons)
- `player_id` (UUID, Foreign Key to Players)
- `team_id` (UUID, Foreign Key to Teams)
- `games_played` (Integer)
- `goals` (Integer)
- `assists` (Integer)
- `points` (Integer)
- `created_at` (Timestamp)

## Views

### Standings View
Provides team rankings based on:
- Season name
- Team name
- Games played
- Wins, losses, ties
- Points
- Goals for/against
- Goal differential

### Scoring Leaders View
Displays player statistics including:
- Season name
- Player name
- Team name
- Games played
- Goals
- Assists
- Total points

## Automated Functions

### Team Stats Update
Automatically updates team statistics after game completion:
- Updates wins/losses/ties
- Calculates points (Win: 3, Tie: 1, Loss: 0)
- Updates goals for/against

### Player Stats Update
Automatically updates player statistics when goals are recorded:
- Updates scorer's goals and points
- Updates assisters' assists and points