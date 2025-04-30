# Scoreboard Application Workflow Documentation

## Overview

This document outlines the workflow and component interactions in the Scoreboard application, a real-time sports scoring system built with Next.js and Supabase.

## Core Components

### Game Timer (gameTimer.js)

The GameTimer class manages the game clock functionality:

- Handles 8-minute periods
- Provides time tracking in both countdown and elapsed time formats
- Supports start, stop, and reset operations
- Maintains game clock state (running/stopped)

Key Methods:

- `start()`: Initiates the timer countdown
- `stop()`: Pauses the timer
- `reset()`: Resets the timer to initial state
- `getStatus()`: Returns current timer state including time strings and running status

### Game Context (GameContext.js)

The GameContext provides global state management and game operations:

State Management:

- Game identification
- Team information (home/away)
- Score tracking
- Shot counting
- Period management
- Clock status

Key Operations:

1. Game Initialization:

   - `initializeGame(homeTeamId, awayTeamId)`: Creates new game instance
   - Sets up initial game state
   - Establishes team information

2. Score Management:

   - `handleScoreChange(team, change)`: Updates team scores
   - Records goals with timestamps
   - Validates score changes

3. Shot Tracking:

   - `handleShotChange(team, change)`: Manages shot counts
   - Updates shot statistics in real-time

4. Period Control:

   - `handlePeriodChange(change)`: Manages game periods
   - Validates period boundaries (1-4)
   - Resets timer on period change

5. Clock Control:
   - `handleClockToggle()`: Toggles game clock
   - Synchronizes with GameTimer instance

### Goal Modal (GoalModal.js)

Handles goal recording interface:

- Player selection for scorer and assists
- Validation of selections
- Real-time updates to game state

Features:

- Scorer selection (required)
- Primary assist selection (optional)
- Secondary assist selection (optional)
- Input validation
- Dynamic player filtering

## Data Flow

1. Game Initialization:

```
User Action → initializeGame() → Create Game in DB → Update GameContext → Render UI
```

2. Scoring Workflow:

```
Goal Scored → GoalModal → Record Goal → Update GameContext → Update DB → Real-time UI Update
```

3. Clock Management:

```
Clock Toggle → GameTimer Update → GameContext Update → UI Refresh (Every Second)
```

## State Management

1. Game State Updates:

- Managed through GameContext
- Real-time synchronization with database
- Automatic UI updates through React state

2. Timer State:

- Independent timer instance
- Syncs with game state every second
- Maintains accuracy through interval-based updates

## Error Handling

1. Game Operations:

- Validates game existence before operations
- Error logging for failed operations
- User feedback for failed actions

2. Input Validation:

- Score and shot value validation
- Period boundary checking
- Required field validation in GoalModal

## Best Practices

1. State Management:

- Centralized game state
- Controlled component updates
- Efficient re-rendering

2. Real-time Updates:

- Optimistic UI updates
- Immediate user feedback
- Background synchronization

3. Error Prevention:

- Input validation
- State boundaries
- Proper error handling

## Component Integration

The application follows a hierarchical structure where:

- GameProvider wraps the application
- Components consume game context through useGame hook
- UI components react to state changes automatically
- Modal components handle specific game events
