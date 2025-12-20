export default function exportData(games, lists) {
  // Convert games array with poster as base64
  const processedGames = games.map((game) => ({
    ...game,
    poster: game.getPosterAsBase64()
  }));

 
  // Combine both into a single object
  const exportData = {
    games: processedGames,
    lists: lists,
    exportDate: new Date().toISOString()
  };

  // Convert to JSON string
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `data-export-${Date.now()}.json`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}