// utils/importGames.js
export default async function importGames() {
  const file = await new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (event) => {
      resolve(event.target.files[0]);
    };

    input.click();
  });

  if (!file) return;

  const text = await file.text();
  let games = JSON.parse(text);

  // Convert base64 posters back to Uint8Array
  games = games.map((game) => {
    if (game.poster) {
      const binaryString = atob(game.poster); // decode base64
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      game.poster = bytes;
    }
    return game;
  });

  // Call your backend import function
  return await window.api.importGames(games);
}
