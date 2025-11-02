// backend/api/endpoints/getGames.js

/**
 * Fetches all games with their posters from the database
 * @param {Object} db - SQLite database connection
 * @returns {Promise<Array>} Array of game objects with poster data
 */
async function getGames(db) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          games.id AS game_id,
          games.title,
          games.release,
          games.description,
          games.rating,
          games.favorite,
          games.date_added,
          posters.id AS poster_id,
          posters.poster
        FROM games
        LEFT JOIN posters ON games.id = posters.game_id`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    console.log(`Fetched ${rows.length} game(s) from the database.`);

    // Log clean game info
    const gamesForLogging = rows.map(game => ({
      id: game.game_id,
      title: game.title,
      release: game.release,
      description: game.description,
      rating: game.rating,
      favorite: game.favorite,
      date_added: game.date_added,
      poster: game.poster ? `<Buffer ${game.poster.length} bytes>` : null
    }));

    console.log('Games data:', JSON.stringify(gamesForLogging, null, 2));

    return rows.map(row => ({
      id: row.game_id,
      title: row.title,
      release: row.release,
      description: row.description,
      rating: row.rating,
      favorite: row.favorite,
      date_added: row.date_added,
      poster: row.poster,
    }));

  } catch (err) {
    console.error('Failed to fetch games:', err.message);
    throw new Error(`Failed to fetch games: ${err.message}`);
  }
}

module.exports = { getGames };
