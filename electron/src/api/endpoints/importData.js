// api/endpoints/importData.ts
const { Game, Poster, List, ListItem, sequelize } = require('../sqlite/models/index');


/**
 * Import games and lists from a JSON string
 * Overwrites the existing database in a safe, transactional way
 * @param {string} jsonString - JSON string containing { games: [...], lists: [...] }
 */
async function importData(jsonString) {
  let transaction;

  try {
    const data = JSON.parse(jsonString);
    if (!data.games || !Array.isArray(data.games)) data.games = [];
    if (!data.lists || !Array.isArray(data.lists)) data.lists = [];

    // Start transaction for safety
    transaction = await sequelize.transaction();

    console.log('Clearing existing games, posters, lists, and list items...');

    // Clear old data safely
    await ListItem.destroy({ where: {}, transaction });
    await Poster.destroy({ where: {}, transaction });
    await Game.destroy({ where: {}, transaction });
    await List.destroy({ where: {}, transaction });

    console.log('Inserting new games...');

    // Insert games and their posters
    for (const game of data.games) {
      const { poster, ...gameData } = game;

      // Ensure date_added is set
      gameData.date_added = gameData.date_added || new Date().toISOString();

      // Create Game
      const newGame = await Game.create(gameData, { transaction });

      // Create Poster if exists
      if (poster) {
        const posterBuffer = poster instanceof Uint8Array ? Buffer.from(poster) : poster;
        await Poster.create({ game_id: newGame.id, poster: posterBuffer }, { transaction });
      }
    }

    console.log('Inserting new lists...');

    // Insert lists and link games
    for (const list of data.lists) {
      const { games: listGames = [], ...listData } = list;

      const newList = await List.create(listData, { transaction });

      // Link games via ListItem
      for (const gameId of listGames) {
        // Ensure the game exists
        const gameExists = await Game.findByPk(gameId, { transaction });
        if (gameExists) {
          await ListItem.create(
            { list_id: newList.id, game_id: gameId },
            { transaction }
          );
        }
      }
    }

    // Commit transaction
    await transaction.commit();
    console.log('✓ Import completed successfully.');
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Failed to import data:', err.message);
    throw new Error(`Failed to import data: ${err.message}`);
  }
}

module.exports = { importData };
