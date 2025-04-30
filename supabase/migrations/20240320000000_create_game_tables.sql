-- Create games table to store game sessions
create table if not exists public.games (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    home_team_id uuid not null references public.teams(id),
    away_team_id uuid not null references public.teams(id),
    period smallint not null default 8,
    home_score integer not null default 0,
    away_score integer not null default 0,
    home_shots integer not null default 0,
    away_shots integer not null default 0,
    status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
    start_time timestamp with time zone,
    end_time timestamp with time zone
);

-- Create game_events table to store timeline events (goals, etc.)
create table if not exists public.game_events (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    game_id uuid not null references public.games(id) on delete cascade,
    team_id uuid not null references public.teams(id),
    event_type text not null check (event_type in ('goal')),
    period smallint not null,
    game_time interval not null,
    scorer_id uuid not null references public.players(id),
    primary_assist_id uuid references public.players(id),
    secondary_assist_id uuid references public.players(id)
);

-- Create player_game_stats table to track individual player statistics
create table if not exists public.player_game_stats (
    id uuid default gen_random_uuid() primary key,
    game_id uuid not null references public.games(id) on delete cascade,
    player_id uuid not null references public.players(id),
    team_id uuid not null references public.teams(id),
    goals integer not null default 0,
    assists integer not null default 0,
    unique(game_id, player_id)
);

-- Create RLS policies
alter table public.games enable row level security;
alter table public.game_events enable row level security;
alter table public.player_game_stats enable row level security;

-- Games policies
create policy "Games are viewable by everyone"
    on public.games for select
    using (true);

create policy "Games are insertable by authenticated users"
    on public.games for insert
    with check (auth.role() = 'authenticated');

create policy "Games are updatable by authenticated users"
    on public.games for update
    using (auth.role() = 'authenticated');

-- Game events policies
create policy "Game events are viewable by everyone"
    on public.game_events for select
    using (true);

create policy "Game events are insertable by authenticated users"
    on public.game_events for insert
    with check (auth.role() = 'authenticated');

create policy "Game events are updatable by authenticated users"
    on public.game_events for update
    using (auth.role() = 'authenticated');

-- Player game stats policies
create policy "Player game stats are viewable by everyone"
    on public.player_game_stats for select
    using (true);

create policy "Player game stats are insertable by authenticated users"
    on public.player_game_stats for insert
    with check (auth.role() = 'authenticated');

create policy "Player game stats are updatable by authenticated users"
    on public.player_game_stats for update
    using (auth.role() = 'authenticated');

-- Create indexes for better query performance
create index if not exists idx_games_home_team on public.games(home_team_id);
create index if not exists idx_games_away_team on public.games(away_team_id);
create index if not exists idx_game_events_game on public.game_events(game_id);
create index if not exists idx_game_events_team on public.game_events(team_id);
create index if not exists idx_player_game_stats_game on public.player_game_stats(game_id);
create index if not exists idx_player_game_stats_player on public.player_game_stats(player_id);

-- Add updated_at trigger function
create or replace function public.handle_updated_at()
 returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_updated_at
    before update on public.games
    for each row
    execute function public.handle_updated_at();