// api/endpoints/importGames.js
import addGame from "../addGame";

/**
 * Imports games: deletes all existing games and adds the new ones sequentially
 * @param {Object} db - SQLite database connection
 * @param {Array} newGames - Array of game objects to import
 */
async function importGames(db, newGames) {
    console.log(newGames);
  try {
    console.log("Starting import...");

    // Begin transaction
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', err => (err ? reject(err) : resolve()));
    });

    // Delete all existing games
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM games', err => (err ? reject(err) : resolve()));
    });
    console.log('All existing games deleted.');

    // Add new games **one by one, sequentially**
    for (const game of newGames) {
      await addGame(db, game);
    }
    console.log(`Added ${newGames.length} new games.`);

    // Commit transaction
    await new Promise((resolve, reject) => {
      db.run('COMMIT', err => (err ? reject(err) : resolve()));
    });

    console.log('Import completed successfully.');
    return true;
  } catch (err) {
    // Rollback if anything fails
    await new Promise((resolve) => db.run('ROLLBACK', resolve));
    console.error('Error during import, rollback applied:', err);
    throw err;
  }
}

export default importGames;
