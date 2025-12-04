export default function exportGames(games) {
  // Convert games array to JSON string
   games = games.map((game) => {
    game = { ...game, poster: game.getPosterAsBase64() };
    return game;
  })

 const jsonString = JSON.stringify(games, null, 2);
  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `games-export-${Date.now()}.json`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


