'use client';

export function generateGameSummaryCSV(teams, timeline, gameState) {
  let csvContent = [];

  // Game Overview Section
  csvContent.push(['Game Summary']);
  csvContent.push(['Period', gameState.period]);
  csvContent.push(['Time', gameState.elapsedTimeString || '00:00']);
  csvContent.push([]);

  // Team Statistics Section
  csvContent.push(['Team Statistics']);
  csvContent.push(['Team', 'Score', 'Shots']);
  teams.forEach(team => {
    csvContent.push([team.name, team.score, team.shots]);
  });
  csvContent.push([]);

  // Player Statistics Section
  teams.forEach(team => {
    csvContent.push([`${team.name} Roster`]);
    csvContent.push(['Number', 'Name', 'Position', 'Goals', 'Assists']);
    team.roster.forEach(player => {
      if (player.name !== '-') {
        csvContent.push([player.number, player.name, player.position, player.goals, player.assists]);
      }
    });
    csvContent.push([]);
  });

  // Scoring Timeline Section
  csvContent.push(['Scoring Timeline']);
  csvContent.push(['Time', 'Period', 'Team', 'Scorer', 'Primary Assist', 'Secondary Assist']);
  timeline.forEach(event => {
    csvContent.push([
      event.time,
      event.period,
      event.teamName,
      event.scorerNumber,
      event.assisterNumber || '',
      event.secondAssisterNumber || ''
    ]);
  });

  // Convert array to CSV string
  const csvString = csvContent
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvString;
}

export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}