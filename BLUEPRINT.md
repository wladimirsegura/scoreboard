# Ice Hockey Scoreboard App Blueprint

## Overview
A real-time ice hockey scoreboard application built with Next.js and Supabase, featuring live score updates, period tracking, and team management.

## Features

### Core Features
- Real-time score tracking
- Period tracking (3 periods + overtime)
- Penalty tracking with countdown
- Shot count tracking
- Team management
- Game clock with start/stop/reset

### Additional Features
- Historical game logs
- Team statistics
- Player statistics
- Live game status indicators

## Technical Architecture

### Frontend Structure
```
src/
  app/
    (auth)/           # Authentication related pages
      login/
      register/
    (dashboard)/      # Admin dashboard
      games/
      teams/
      players/
    components/       # Reusable components
      scoreboard/
      controls/
      stats/
    styles/          # Custom styles
    utils/           # Utility functions
```

### Database Schema (Supabase)

```sql
-- Teams table
table teams {
  id: uuid
  name: string
  logo_url: string
  created_at: timestamp
}

-- Players table
table players {
  id: uuid
  team_id: uuid
  number: integer
  name: string
  position: string
}

-- Games table
table games {
  id: uuid
  home_team_id: uuid
  away_team_id: uuid
  home_score: integer
  away_score: integer
  period: integer
  clock: string
  status: string
  date: timestamp
}

-- Penalties table
table penalties {
  id: uuid
  game_id: uuid
  team_id: uuid
  player_id: uuid
  duration: integer
  start_time: timestamp
  end_time: timestamp
}

-- Shots table
table shots {
  id: uuid
  game_id: uuid
  team_id: uuid
  period: integer
  count: integer
}
```

## UI/UX Design

### Color Scheme
- Primary: Deep Navy (#0A192F)
- Secondary: Steel Blue (#1F2937)
- Accent: Crimson (#DC2626)
- Background: Dark Slate (#111827)
- Text: Ice White (#F3F4F6)
- Muted Text: Cool Gray (#9CA3AF)
- Border: Midnight Blue (#1E3A8A)
- Success: Emerald (#059669)
- Warning: Amber (#D97706)

### Main Components
1. Scoreboard Display
   - Team names and logos
   - Current score
   - Period indicator
   - Game clock
   - Shot counts
   - Active penalties

2. Admin Control Panel
   - Score adjustment buttons
   - Period controls
   - Clock controls
   - Penalty management
   - Shot counter controls

3. Game History View
   - List of past games
   - Detailed game statistics
   - Exportable game reports

## Implementation Phases

### Phase 1: Core Setup
- Project initialization
- Database schema implementation
- Basic UI components
- Authentication system

### Phase 2: Basic Functionality
- Score tracking
- Period management
- Game clock
- Team management

### Phase 3: Advanced Features
- Penalty tracking
- Shot counting
- Statistics tracking
- Historical data

### Phase 4: Polish
- UI/UX improvements
- Performance optimization
- Testing and bug fixes
- Documentation

## Tech Stack
- Frontend: Next.js
- Styling: Tailwind CSS
- Database: Supabase
- Authentication: Supabase Auth
- Real-time Updates: Supabase Realtime
- Deployment: Vercel