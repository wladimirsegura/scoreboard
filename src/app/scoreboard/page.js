'use client';

import { GameStateProvider } from '../context/GameStateContext';
import { TeamsProvider } from '../context/TeamsContext';
import ScoreboardDisplay from '../components/scoreboard/ScoreboardDisplay';
import AdminControls from '../components/controls/AdminControls';
import TeamManagement from '../components/controls/TeamManagement';
import Timeline from '../components/Timeline';
import GameInitializer from '../components/GameInitializer';


export default function Home() {
  return (
    <main className="min-h-screen bg-[#111827] py-8 px-4">
      <GameStateProvider>
        <TeamsProvider>
          <GameInitializer>
            <ScoreboardDisplay />
            <div className="space-y-4">
              <AdminControls />
              <Timeline />
              <TeamManagement />
            </div>
          </GameInitializer>
        </TeamsProvider>
      </GameStateProvider>
    </main>
  );
}
