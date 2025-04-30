'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createGameTimer } from '../utils/gameTimer';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [gameTimer] = useState(() => createGameTimer());
  const [gameState, setGameState] = useState({

    id: null,
    homeTeam: {
      id: null,
      name: 'Home Team',
      score: 0,
      shots: 0
    },
    awayTeam: {
      id: null,
      name: 'Away Team',
      score: 0,
      shots: 0
    },
    period: 1,
    clock: '8:00',
    isRunning: false,
    elapsedTime: '00:00',
    elapsedTimeString: '00:00',
    elapsedSeconds: 0
  });

  useEffect(() => {
    const updateClock = () => {
      const status = gameTimer.getStatus();
      setGameState(prev => ({
        ...prev,
        clock: status.timeString,
        elapsedTime: status.elapsedTimeString,
        elapsedTimeString: status.elapsedTimeString,
        elapsedSeconds: status.elapsedSeconds,
        isRunning: status.isRunning
      }));
    };

    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [gameTimer]);

  const handleScoreChange = async (team, change) => {
    if (!gameState.id) return;

    const teamId = gameState[team].id;
    if (change > 0) {
      // Record a goal
      const response = await fetch('/api/games/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: gameState.id,
          teamId,
          eventType: 'goal',
          period: gameState.period,
          timeElapsed: gameState.elapsedTimeString
        })
      });

      if (!response.ok) {
        console.error('Failed to record goal');
        return;
      }
    }

    setGameState(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        score: Math.max(0, prev[team].score + change)
      }
    }));
  };

  const handleShotChange = async (team, change) => {
    if (!gameState.id) return;

    const updates = {
      [`${team === 'homeTeam' ? 'home' : 'away'}_shots`]: Math.max(0, gameState[team].shots + change)
    };

    const response = await fetch(`/api/games?id=${gameState.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      console.error('Failed to update shots');
      return;
    }

    setGameState(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        shots: Math.max(0, prev[team].shots + change)
      }
    }));
  };

  const handlePeriodChange = async (change) => {
    if (!gameState.id) return;

    const newPeriod = Math.max(1, Math.min(4, gameState.period + change));
    const response = await fetch(`/api/games?id=${gameState.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ period: newPeriod })
    });

    if (!response.ok) {
      console.error('Failed to update period');
      return;
    }

    gameTimer.reset();
    setGameState(prev => ({
      ...prev,
      period: newPeriod,
      clock: '20:00',
      isRunning: false
    }));
  };

  const handleClockToggle = () => {
    if (gameTimer.isRunning) {
      gameTimer.stop();
    } else {
      gameTimer.start();
    }
  };

  const initializeGame = async (homeTeamId, awayTeamId) => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeTeamId, awayTeamId })
      });

      if (!response.ok) {
        throw new Error('Failed to initialize game');
      }

      const { data: game } = await response.json();

      // Reset game state with new game data
      setGameState({
        id: game.id,
        homeTeam: {
          id: game.home_team_id,
          name: 'Home Team',
          score: 0,
          shots: 0
        },
        awayTeam: {
          id: game.away_team_id,
          name: 'Away Team',
          score: 0,
          shots: 0
        },
        period: 1,
        clock: '20:00',
        isRunning: false,
        elapsedTime: '00:00',
        elapsedTimeString: '00:00',
        elapsedSeconds: 0
      });

      gameTimer.reset();
      return game;
    } catch (error) {
      console.error('Error initializing game:', error);
      throw error;
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        handleScoreChange,
        handleShotChange,
        handlePeriodChange,
        handleClockToggle,
        initializeGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};