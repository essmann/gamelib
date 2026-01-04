/**
 * Fetches a full game by ID from the external_games database including all details and poster
 * @param {Object} db - SQLite database connection
 * @param {number|string} id - Game ID to fetch
 * @returns {Promise<Object>} Full game object with all data including poster
 */
async function getExternalGameById(db, id) {
  try {
    const query = `
      SELECT 
        games.id AS game_id,
        games.title,
        games.release,
        games.short_description,
        games.detailed_description,
        games.genres,
        games.developers,
        games.publishers,
        games.categories,
        posters.image AS poster
      FROM games
      LEFT JOIN posters ON games.id = posters.id
      WHERE games.id = ?
    `;

    const row = await new Promise((resolve, reject) => {
      db.get(query, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });

    if (!row) {
      throw new Error(`Game with ID ${id} not found in external database`);
    }

    console.log(`Fetched full game data for ID ${id} from external database`);

    // Return the full game object with all data
    return {
      id: row.game_id,
      title: row.title,
      release: row.release,
      shortDescription: row.short_description,
      detailedDescription: row.detailed_description,
      genres: row.genres,
      developers: row.developers,
      publishers: row.publishers,
      categories: row.categories,
      poster: row.poster
    };

  } catch (err) {
    console.error('Failed to fetch game by ID:', err.message);
    throw new Error(`Failed to fetch game by ID: ${err.message}`);
  }
}

module.exports = { getExternalGameById };
