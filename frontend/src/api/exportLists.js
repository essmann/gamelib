export default function exportLists(lists) {
  // Convert lists array to JSON string
   lists = lists.map((game) => {
    list = { ...game, poster: game.getPosterAsBase64() };
    return game;
  })

 const jsonString = JSON.stringify(lists, null, 2);
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


