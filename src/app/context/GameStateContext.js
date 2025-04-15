'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createGameTimer } from '../utils/gameTimer';

const GameStateContext = createContext();

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

export const GameStateProvider = ({ children }) => {
  const [gameTimer] = useState(() => createGameTimer());
  const [gameState, setGameState] = useState({
    homeTeam: {
      name: 'Home Team',
      score: 0,
      shots: 0
    },
    awayTeam: {
      name: 'Away Team',
      score: 0,
      shots: 0
    },
    period: 1,
    clock: '10:00',
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

  const handleScoreChange = (team, change) => {
    setGameState(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        score: Math.max(0, prev[team].score + change)
      }
    }));
  };

  const handleShotChange = (team, change) => {
    setGameState(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        shots: Math.max(0, prev[team].shots + change)
      }
    }));
  };

  const handlePeriodChange = (change) => {
    gameTimer.reset();
    setGameState(prev => ({
      ...prev,
      period: Math.max(1, Math.min(4, prev.period + change)),
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



  const value = {
    gameState,
    handleScoreChange,
    handleShotChange,
    handlePeriodChange,
    handleClockToggle
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};