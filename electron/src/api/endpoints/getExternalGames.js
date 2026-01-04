// backend/api/endpoints/getGames.js

/**
 * Fetches games (optionally filtered by title prefix) without poster data to save memory
 * @param {Object} db - SQLite database connection
 * @param {string} [prefix] - Optional prefix to filter game titles
 * @returns {Promise<Array>} Array of game objects (no poster data for search results)
 */
async function getExternalGames(db, prefix = '') {
  try {
    const query = `
      SELECT 
        games.id AS game_id,
        games.title,
        games.release,
        games.short_description AS description,
        games.genres,
        games.developers,
        games.publishers
      FROM games
      ${prefix ? 'WHERE games.title LIKE ?' : ''}
      LIMIT 100
    `;

    const params = prefix ? [`${prefix}%`] : [];

    const rows = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    console.log(`Fetched ${rows.length} game(s) from the database.`);

    // Return cleaned rows without poster data (saves memory)
    return rows.map(row => ({
      id: row.game_id,
      title: row.title,
      release: row.release,
      description: row.description,
      genres: row.genres,
      developers: row.developers,
      publishers: row.publishers
    }));

  } catch (err) {
    console.error('Failed to fetch games:', err.message);
    throw new Error(`Failed to fetch games: ${err.message}`);
  }
}

module.exports = { getExternalGames };
