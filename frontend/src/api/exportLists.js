export default function exportLists(lists) {
  // Convert lists array, stripping IDs for fresh autoincrement on import
  const processedLists = lists.map((list) => {
    const { id, ...listWithoutId } = list; // Remove id
    // Also remove game IDs from the games array in the list
    const processedGames = (listWithoutId.games || []).map((game) => {
      const { id: gameId, ...gameWithoutId } = game;
      return gameWithoutId;
    });
    return {
      ...listWithoutId,
      games: processedGames
    };
  });

  const jsonString = JSON.stringify(processedLists, null, 2);
  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lists-export-${Date.now()}.json`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


