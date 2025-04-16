'use client';

import { createContext, useContext, useState } from 'react';
import { useGameState } from './GameStateContext';

const TeamsContext = createContext();

export function TeamsProvider({ children }) {
  const { gameState } = useGameState();
  const [timeline, setTimeline] = useState([]);
  const [activeTeams, setActiveTeams] = useState([]);
  const [teams, setTeams] = useState([
    { 
      id: 1, 
      name: 'ヘベウデス', 
      score: 0, 
      shots: 0,
      roster: [
        { id: 1, number: '96', name: 'セグラW', position: 'FW', goals: 0, assists: 0 },
        { id: 2, number: '0', name: '住垣 智之', position: 'C', goals: 0, assists: 0 },
        { id: 3, number: '0', name: '甲斐田', position: 'DF', goals: 0, assists: 0 },
        { id: 4, number: '3', name: '佐藤まゆみ', position: 'FW', goals: 0, assists: 0 },
        { id: 5, number: '45', name: '相良真吾', position: 'HP', goals: 0, assists: 0 },
        { id: 6, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 7, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 8, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },

      ]
    },
    { 
      id: 2, 
      name: '05ユニティーズ', 
      score: 0, 
      shots: 0,
      roster: [
        { id: 1, number: '10', name: '佐々木 瞬', position: 'C', goals: 0, assists: 0 },
        { id: 2, number: '56', name: '杉村 匠', position: 'C', goals: 0, assists: 0 },
        { id: 3, number: '11', name: '住垣 香奈子', position: 'FW', goals: 0, assists: 0 },
        { id: 4, number: '0', name: '安田 里奈', position: 'FW', goals: 0, assists: 0 },
        { id: 5, number: '0', name: '三田 直樹', position: 'FW', goals: 0, assists: 0 },
        { id: 6, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 7, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 8, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },

      ]
    },
    { 
      id: 3, 
      name: 'TUC', 
      score: 0, 
      shots: 0,
      roster: [
        { id: 1, number: '0', name: '坂上 敬冶', position: 'FW', goals: 0, assists: 0 },
        { id: 2, number: '0', name: '篠崎 美晃', position: 'C', goals: 0, assists: 0 },
        { id: 3, number: '0', name: '川口 星哉', position: 'FW', goals: 0, assists: 0 },
        { id: 4, number: '0', name: '篠崎弘子', position: 'FW', goals: 0, assists: 0 },
        { id: 5, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 6, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 7, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 8, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },

      ]
    },
    { 
      id: 4, 
      name: 'いやさか2000', 
      score: 0, 
      shots: 0,
      roster: [
        { id: 1, number: '0', name: '高橋 義弘', position: 'C', goals: 0, assists: 0 },
        { id: 2, number: '0', name: '中野 隆治', position: 'C', goals: 0, assists: 0 },
        { id: 3, number: '0', name: '佐藤 祐子', position: 'FW', goals: 0, assists: 0 },
        { id: 4, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 5, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 6, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 7, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 8, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
      ]
    },
    { 
      id: 5, 
      name: 'Undefeated', 
      score: 0, 
      shots: 0,
      roster: [
        { id: 1, number: '0', name: '佐藤 豪太', position: 'C', goals: 0, assists: 0 },
        { id: 2, number: '0', name: '中野 ', position: 'C', goals: 0, assists: 0 },
        { id: 3, number: '0', name: '南', position: 'FW', goals: 0, assists: 0 },
        { id: 4, number: '0', name: '木村 雅直', position: 'DF', goals: 0, assists: 0 },
        { id: 5, number: '0', name: '服部 光秀', position: 'DF', goals: 0, assists: 0 },
        { id: 6, number: '0', name: '土谷 力', position: 'FW', goals: 0, assists: 0 },
        { id: 7, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 8, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
      ]
    },
    { 
      id: 6, 
      name: 'コンパネロス', 
      score: 0, 
      shots: 0,
      roster: [
        { id: 1, number: '0', name: 'せいじ', position: 'C', goals: 0, assists: 0 },
        { id: 2, number: '0', name: '-', position: 'C', goals: 0, assists: 0 },
        { id: 3, number: '0', name: '-', position: 'FW', goals: 0, assists: 0 },
        { id: 4, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 5, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 6, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 7, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
        { id: 8, number: '0', name: '-', position: 'HP', goals: 0, assists: 0 },
      ]
    }
  ]);

  const addPlayer = (teamId) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const newPlayerId = team.roster.length + 1;
        return {
          ...team,
          roster: [...team.roster, { id: newPlayerId, number: '', name: '', position: '', goals: 0, assists: 0 }]
        };
      }
      return team;
    }));
  };

  const updatePlayer = (teamId, playerId, field, value) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          roster: team.roster.map(player =>
            player.id === playerId ? { ...player, [field]: value } : player
          )
        };
      }
      return team;
    }));
  };

  const removePlayer = (teamId, playerId) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          roster: team.roster.filter(player => player.id !== playerId)
        };
      }
      return team;
    }));
  };

  const updateTeamName = (teamId, newName) => {
    setTeams(teams.map(team =>
      team.id === teamId ? { ...team, name: newName } : team
    ));
  };

  const updateTeamScore = (teamId, newScore) => {
    setTeams(teams.map(team =>
      team.id === teamId ? { ...team, score: newScore } : team
    ));
  };

  const updateTeamShots = (teamId, newShots) => {
    setTeams(teams.map(team =>
      team.id === teamId ? { ...team, shots: newShots } : team
    ));
  };

  const recordGoal = (teamId, scorerId, assistId, secondAssistId, time) => {
    const scoringTeam = teams.find(team => team.id === teamId);
    const scorer = scoringTeam.roster.find(player => player.id === scorerId);
    const assister = assistId ? scoringTeam.roster.find(player => player.id === assistId) : null;
    const secondAssister = secondAssistId ? scoringTeam.roster.find(player => player.id === secondAssistId) : null;

    setTimeline([...timeline, {
      time,
      period: gameState.period,
      teamName: scoringTeam.name,
      scorerNumber: scorer.number,
      assisterNumber: assister ? assister.number : null,
      secondAssisterNumber: secondAssister ? secondAssister.number : null
    }]);
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          score: team.score + 1,
          roster: team.roster.map(player => {
            if (player.id === scorerId) {
              return {
                ...player,
                goals: player.goals + 1
              };
            }
            if (player.id === assistId || player.id === secondAssistId) {
              return {
                ...player,
                assists: player.assists + 1
              };
            }
            return player;
          })
        };
      }
      return team;
    }));
  };

  const removeGoal = (event) => {
    const team = teams.find(t => t.name === event.teamName);
    const scorer = team.roster.find(player => player.number === event.scorerNumber);
    const assister = event.assisterNumber ? team.roster.find(player => player.number === event.assisterNumber) : null;
    const secondAssister = event.secondAssisterNumber ? team.roster.find(player => player.number === event.secondAssisterNumber) : null;

    setTimeline(timeline.filter(t => t !== event));
    setTeams(teams.map(t => {
      if (t.id === team.id) {
        return {
          ...t,
          score: t.score - 1,
          roster: t.roster.map(player => {
            if (player.number === event.scorerNumber) {
              return { ...player, goals: player.goals - 1 };
            }
            if ((assister && player.number === event.assisterNumber) ||
                (secondAssister && player.number === event.secondAssisterNumber)) {
              return { ...player, assists: player.assists - 1 };
            }
            return player;
          })
        };
      }
      return t;
    }));
  };

  const setSelectedTeams = (teamIds) => {
    setActiveTeams(teamIds);
  };

  const getActiveTeams = () => {
    return teams.filter(team => activeTeams.includes(team.id));
  };

  return (
    <TeamsContext.Provider value={{
      timeline,
      teams,
      activeTeams,
      getActiveTeams,
      setSelectedTeams,
      updateTeamName,
      updateTeamScore,
      updateTeamShots,
      addPlayer,
      updatePlayer,
      removePlayer,
      recordGoal,
      removeGoal
    }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  // Get both teams and timeline from context
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
}