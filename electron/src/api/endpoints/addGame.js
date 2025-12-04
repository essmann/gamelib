import Game from "../game";

/**
 * Adds a new game to the database with its poster image
 * @param {Object} db - SQLite database connection
 * @param {Object} game - Game object containing all game details
 * @returns {Promise<Game>} The newly created Game instance
 */
async function addGame(db, game) {
  console.log("Test");

  // Convert poster to Buffer if it's a Uint8Array
  const posterBuffer = game.poster instanceof Uint8Array ? Buffer.from(game.poster) : null;

  // Ensure date_added is always set
  game.date_added = game.date_added || new Date().toISOString();

  // Exclude poster and id from the `games` table insert
  const { poster, id, ...gameData } = game;

  const columns = Object.keys(gameData);
  const placeholders = columns.map(() => '?').join(', ');
  const values = Object.values(gameData);

  console.log(
    'Adding game:',
    JSON.stringify(
      { ...gameData, poster: posterBuffer ? `<Buffer ${posterBuffer.length} bytes>` : null },
      null,
      2
    )
  );

  try {
    // Insert game into games table
    const gameId = await new Promise((resolve, reject) => {
      const sql = `INSERT INTO games (${columns.join(', ')}) VALUES (${placeholders})`;
      db.run(sql, values, function (err) {
        if (err) {
          console.error('Error inserting game:', err);
          reject(err);
        } else {
          console.log(`Game added with ID: ${this.lastID} (${this.changes} row(s) affected)`);
          resolve(this.lastID);
        }
      });
    });

    // Insert poster into posters table (if provided)
    if (posterBuffer) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO posters (game_id, poster) VALUES (?, ?)',
          [gameId, posterBuffer],
          function (err) {
            if (err) {
              console.error('Error inserting poster:', err);
              reject(err);
            } else {
              console.log(`Poster added for game ID: ${gameId} (${this.changes} row(s) affected)`);
              resolve();
            }
          }
        );
      });
    } else {
      console.log('No poster provided for game ID:', gameId);
    }

    console.log(`✓ Successfully added game: "${game.title}" (ID: ${gameId})`);
    return new Game({ ...game, id: gameId });
  } catch (err) {
    console.error('Failed to add game:', err.message);
    throw new Error(`Failed to add game: ${err.message}`);
  }
}

export default addGame;
