// backend/api/endpoints/getGames.js

/**
 * Fetches all games with their posters from the database
 * @param {Object} db - SQLite database connection
 * @returns {Promise<Array>} Array of game objects with poster data
 */
async function getGames(db) {
  try {
    // Get all column names from the 'games' table dynamically
    const columns = await new Promise((resolve, reject) => {
      db.all(`PRAGMA table_info(games);`, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(r => r.name));
      });
    });

    const columnList = columns.map(c => `games.${c}`).join(', ');

    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          ${columnList},
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

    const gamesForLogging = rows.map(game => ({
      ...game,
      poster: game.poster ? `<Buffer ${game.poster.length} bytes>` : null
    }));

    console.log('Games data:', JSON.stringify(gamesForLogging, null, 2));

    // Return results
    return rows.map(row => ({
      ...row,
      poster: row.poster,
    }));

  } catch (err) {
    console.error('Failed to fetch games:', err.message);
    throw new Error(`Failed to fetch games: ${err.message}`);
  }
}

module.exports = { getGames };
