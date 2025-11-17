// api/endpoints/addGame.js
import  Game  from "../game";

/**
 * Adds a new game to the database with its poster image
 * @param {Object} db - SQLite database connection
 * @param {Object} game - Game object containing all game details
 * @returns {Promise<Game>} The newly created Game instance
 */
async function addGame(db, game) {
  console.log("Test");


  // Convert poster to Buffer if it's a Uint8Array
  const poster = game.poster instanceof Uint8Array 
    ? Buffer.from(game.poster)
    : null;

  // Generate a unique ID if not provided
  if (!game.id) {
    game.id = Math.floor(Math.random() * 10e9);
  }

  // Ensure date_added is always set
  game.date_added = game.date_added || new Date().toISOString();

  // Exclude poster from the `games` table insert
  const { poster: _, ...gameData } = game;

  // Dynamically build the query parts
  const columns = Object.keys(gameData);
  const placeholders = columns.map(() => '?').join(', ');
  const values = Object.values(gameData);

  // Log the query (for debugging)
  console.log('Adding game:', JSON.stringify({ ...gameData, poster: poster ? `<Buffer ${poster.length} bytes>` : null }, null, 2));

  try {
    // Insert game into games table
    await new Promise((resolve, reject) => {
      const sql = `INSERT INTO games (${columns.join(', ')}) VALUES (${placeholders})`;
      db.run(sql, values, function (err) {
        if (err) {
          console.error('Error inserting game:', err);
          reject(err);
        } else {
          console.log(`Game added with ID: ${game.id} (${this.changes} row(s) affected)`);
          resolve();
        }
      });
    });

    // Insert poster into posters table (if provided)
    if (poster) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO posters (game_id, poster) VALUES (?, ?)',
          [game.id, poster],
          function (err) {
            if (err) {
              console.error('Error inserting poster:', err);
              reject(err);
            } else {
              console.log(`Poster added for game ID: ${game.id} (${this.changes} row(s) affected)`);
              resolve();
            }
          }
        );
      });
    } else {
      console.log('No poster provided for game ID:', game.id);
    }

    console.log(`✓ Successfully added game: "${game.title}" (ID: ${game.id})`);
    return new Game(game);

  } catch (err) {
    console.error('Failed to add game:', err.message);
    throw new Error(`Failed to add game: ${err.message}`);
  }
}

export default addGame;
