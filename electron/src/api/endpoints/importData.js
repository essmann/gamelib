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

    // Clear old data safely (Order matters for Foreign Key constraints)
    await ListItem.destroy({ where: {}, transaction });
    await Poster.destroy({ where: {}, transaction });
    await Game.destroy({ where: {}, transaction });
    await List.destroy({ where: {}, transaction });

    console.log('Inserting new games and posters...');

    // Insert games and their posters
    for (const game of data.games) {
      const { poster, ...gameData } = game;

      // Ensure date_added is set
      gameData.date_added = gameData.date_added || new Date().toISOString();

      // Create Game
      const newGame = await Game.create(gameData, { transaction });

      // Create Poster if exists
      if (poster) {
        let posterBuffer;

        // CASE 1: Poster is a Base64 String (common if coming from a web export)
        if (typeof poster === 'string') {
          // Strip metadata prefix if present (e.g., data:image/png;base64,)
          const base64Data = poster.replace(/^data:image\/\w+;base64,/, "");
          posterBuffer = Buffer.from(base64Data, 'base64');
        } 
        // CASE 2: Poster is a serialized Buffer object { type: "Buffer", data: [...] }
        // This is how Node.js Buffers look after JSON.stringify()
        else if (poster && poster.type === 'Buffer' && Array.isArray(poster.data)) {
          posterBuffer = Buffer.from(poster.data);
        }
        // CASE 3: Poster is already a Uint8Array or Buffer
        else if (poster instanceof Uint8Array || Buffer.isBuffer(poster)) {
          posterBuffer = Buffer.from(poster);
        }
        // CASE 4: Fallback (handles raw arrays or unexpected objects)
        else {
          posterBuffer = Buffer.from(poster);
        }

        await Poster.create(
          { game_id: newGame.id, poster: posterBuffer }, 
          { transaction }
        );
      }
    }

    console.log('Inserting new lists...');

    // Insert lists and link games
    for (const list of data.lists) {
      const { games: listGames = [], ...listData } = list;

      const newList = await List.create(listData, { transaction });

      // Link games via ListItem
      for (const entry of listGames) {
        // Ensure the game exists in our newly created games
        // entry.id should correspond to the IDs provided in the import data
        const gameExists = await Game.findByPk(entry.id, { transaction });
        
        if (gameExists) {
          await ListItem.create(
            { list_id: newList.id, game_id: entry.id },
            { transaction }
          );
        } else {
          console.warn(`Warning: Game ID ${entry.id} not found. Skipping list entry.`);
        }
      }
    }

    // Commit transaction
    await transaction.commit();
    console.log('✓ Import completed successfully.');
  } catch (err) {
    // Rollback on any failure
    if (transaction) await transaction.rollback();
    console.error('Failed to import data:', err.message);
    throw new Error(`Failed to import data: ${err.message}`);
  }
}

module.exports = { importData };