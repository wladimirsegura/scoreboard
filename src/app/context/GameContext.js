'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { gameOperations } from '../lib/supabase';

import { gameSheetOperations } from '../lib/gameSheetOperations';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState({
    homeTeam: { id: null, name: '', score: 0, shots: 0 },
    awayTeam: { id: null, name: '', score: 0, shots: 0 },
    period: 8,
    clock: '8:00',
    isRunning: false
  });

  useEffect(() => {
    if (currentGame) {
      const subscription = gameOperations.subscribeToGame(currentGame.id, (payload) => {
        const { new: updatedGame } = payload;
        if (updatedGame) {
          setGameState(prev => ({
            ...prev,
            homeTeam: {
              ...prev.homeTeam,
              score: updatedGame.home_score,
              shots: updatedGame.home_shots
            },
            awayTeam: {
              ...prev.awayTeam,
              score: updatedGame.away_score,
              shots: updatedGame.away_shots
            },
            period: updatedGame.period,
            isRunning: updatedGame.status === 'in_progress'
          }));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentGame]);

  const initializeGame = async (homeTeamName, awayTeamName) => {
    try {
      const game = await gameOperations.createGame(homeTeamName, awayTeamName);
      setCurrentGame(game);
      setGameState(prev => ({
        ...prev,
        homeTeam: { 
          ...prev.homeTeam, 
          id: game.home_team_id,
          name: homeTeamName
        },
        awayTeam: { 
          ...prev.awayTeam, 
          id: game.away_team_id,
          name: awayTeamName
        }
      }));
      return game;
    } catch (error) {
      console.error('Failed to initialize game:', error);
      throw error;
    }
  };

  const updateGame = async (updates) => {
    if (!currentGame) return;
    try {
      await gameOperations.updateGameState(currentGame.id, updates);
    } catch (error) {
      console.error('Failed to update game:', error);
      throw error;
    }
  };

  const recordGoal = async (teamId, scorerId, primaryAssistId = null, secondaryAssistId = null) => {
    if (!currentGame) return;
    try {
      // Record the goal in the game state
      await gameOperations.recordGoal(
        currentGame.id,
        teamId,
        scorerId,
        primaryAssistId,
        secondaryAssistId
      );

      // Record the goal event in game sheet
      await gameSheetOperations.recordEvent(
        currentGame.id,
        teamId,
        scorerId,
        'goal',
        gameState.period,
        gameState.clock,
        gameState.elapsedTime || '00:00',
        {
          primaryAssistId,
          secondaryAssistId
        }
      );
    } catch (error) {
      console.error('Failed to record goal:', error);
      throw error;
    }
  };

  const recordGameEvent = async (eventType, playerId = null, details = {}) => {
    if (!currentGame) return;
    try {
      const teamId = playerId ? 
        (gameState.homeTeam.players?.includes(playerId) ? gameState.homeTeam.id : gameState.awayTeam.id) : 
        null;

      await gameSheetOperations.recordEvent(
        currentGame.id,
        teamId,
        playerId,
        eventType,
        gameState.period,
        gameState.clock,
        gameState.elapsedTime || '00:00',
        details
      );
    } catch (error) {
      console.error('Failed to record game event:', error);
      throw error;
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        currentGame,
        initializeGame,
        updateGame,
        recordGoal,
        recordGameEvent
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}