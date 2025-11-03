// api/endpoints/addGame.js

/**
 * Adds a new game to the database with its poster image
 * @param {Object} db - SQLite database connection
 * @param {Object} game - Game object containing all game details
 * @returns {Promise<number>} The ID of the newly created game
 */
async function addGame(db, game) {
  // Convert poster to Buffer if it's a Uint8Array
  const poster = game.poster instanceof Uint8Array 
    ? Buffer.from(game.poster) 
    : null;

  // Generate unique game ID
  if(!game.id){
    game.id = Math.floor(Math.random() * 10e9);
  }

  // Log game being added (with truncated poster)
  const gameForLogging = {
    id: game.id,
    title: game.title,
    release: game.release,
    description: game.description,
    rating: game.rating,
    favorite: game.favorite || 0,
    poster: poster ? `<Buffer ${poster.length} bytes>` : null
  };

  console.log('Adding game:', JSON.stringify(gameForLogging, null, 2));

  try {
    // Insert game data into games table
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO games (id, title, release, description, rating, favorite, date_added) 
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          game.id, 
          game.title, 
          game.release, 
          game.description, 
          game.rating, 
          game.favorite || 0
        ],
        function (err) {
          if (err) {
            console.error('Error inserting game:', err);
            reject(err);
          } else {
            console.log(`Game added with ID: ${game.id} (${this.changes} row(s) affected)`);
            resolve({ id: game.id, changes: this.changes });
          }
        }
      );
    });

    // Insert poster into posters table if exists
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
              resolve({ changes: this.changes });
            }
          }
        );
      });
    } else {
      console.log('No poster provided for game ID:', game.id);
    }

    // Log successful addition
    console.log(`✓ Successfully added game: "${game.title}" (ID: ${game.id})`);

    return game.id;

  } catch (err) {
    console.error('Failed to add game:', err.message);
    throw new Error(`Failed to add game: ${err.message}`);
  }
}

module.exports = { addGame };