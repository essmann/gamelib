// backend/api/endpoints/getGames.js

/**
 * Fetches all games (optionally filtered by title prefix) with their posters
 * @param {Object} db - SQLite database connection
 * @param {string} [prefix] - Optional prefix to filter game titles
 * @returns {Promise<Array>} Array of game objects with poster data
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
        games.publishers,
        posters.image as poster
      FROM games
      LEFT JOIN posters ON games.id = posters.id
      ${prefix ? 'WHERE games.title LIKE ?' : ''}
    `;

    const params = prefix ? [`${prefix}%`] : [];

    const rows = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    console.log(`Fetched ${rows.length} game(s) from the database.`);

    // Clean log output
    const gamesForLogging = rows.map(game => ({
      id: game.game_id,
      title: game.title,
      release: game.release,
      description: game.description,
      genres: game.genres,
      developers: game.developers,
      publishers: game.publishers,
      poster: game.poster ? `<Buffer ${game.poster.length} bytes>` : null
    }));

    console.log('Games data:', JSON.stringify(gamesForLogging, null, 2));

    // Return full rows
    return rows.map(row => ({
      id: row.game_id,
      title: row.title,
      release: row.release,
      description: row.description,
      genres: row.genres,
      developers: row.developers,
      publishers: row.publishers,
      poster: row.poster,
    }));

  } catch (err) {
    console.error('Failed to fetch games:', err.message);
    throw new Error(`Failed to fetch games: ${err.message}`);
  }
}

module.exports = { getExternalGames };
