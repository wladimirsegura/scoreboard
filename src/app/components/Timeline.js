'use client';

import React from 'react';
import { useTeams } from '../context/TeamsContext';

export default function Timeline() {
  const { timeline, getActiveTeams } = useTeams();
  const activeTeams = getActiveTeams();

  const teamEvents = activeTeams.map(team => ({
    team,
    events: timeline.filter(event => event.teamName === team.name)
  }));

  const ScoringTable = ({ events, title }) => (
    <div className="w-1/2 px-2">
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left py-2">Period</th>
            <th className="text-left py-2">Time</th>
            <th className="text-left py-2">G</th>
            <th className="text-left py-2">A1</th>
            <th className="text-left py-2">A2</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="py-2">{event.period}</td>
              <td className="py-2">{event.time || '00:00'}</td>
              <td className="py-2">#{event.scorerNumber}</td>
              <td className="py-2">{event.assisterNumber ? `#${event.assisterNumber}` : '-'}</td>
              <td className="py-2">{event.secondAssisterNumber ? `#${event.secondAssisterNumber}` : '-'}</td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr>
              <td colSpan="5" className="py-2 text-gray-400 italic">No scoring events</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Game Timeline</h2>
      <div className="flex -mx-2">
        {teamEvents.map(({ team, events }) => (
          <ScoringTable key={team.id} events={events} title={`${team.name} Scoring`} />
        ))}
      </div>
    </div>
  );
}