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

    console.log('[IMPORT] Clearing existing games, posters, lists, and list items...');

    // Clear old data safely (Order matters for Foreign Key constraints)
    await ListItem.destroy({ where: {}, transaction });
    await Poster.destroy({ where: {}, transaction });
    await Game.destroy({ where: {}, transaction });
    await List.destroy({ where: {}, transaction });

    console.log('[IMPORT] Resetting autoincrement sequences...');
    
    // Reset SQLite sequences to start from 1 by setting seq to 0
    // This clears the sqlite_sequence table entries, allowing autoincrement to restart at 1
    await sequelize.query('UPDATE sqlite_sequence SET seq = 0 WHERE name IN (?, ?, ?)', {
      replacements: ['games', 'lists', 'posters'],
      transaction
    });
    
    // Also delete any rows that might not match (in case of different case or naming)
    await sequelize.query('DELETE FROM sqlite_sequence WHERE name IN (?, ?, ?)', {
      replacements: ['games', 'lists', 'posters'],
      transaction
    });
    
    // Verify reset by checking sqlite_sequence
    const seqCheck = await sequelize.query('SELECT * FROM sqlite_sequence', { transaction });
    console.log('[IMPORT] sqlite_sequence after reset:', seqCheck[0]);

    console.log('[IMPORT] Inserting new games and posters...');

    // Map old IDs to new IDs for list linkage
    const idMap = {}; // Maps old game ID -> new game ID

    // Insert games and their posters
    for (const game of data.games) {
      const { poster, id: oldId, ...gameData } = game; // Extract and discard the old ID

      // Ensure date_added is set
      gameData.date_added = gameData.date_added || new Date().toISOString();

      // Create Game - let Sequelize autoincrement the ID
      const newGame = await Game.create(gameData, { transaction });
      
      // Map old ID to new ID for later list linkage
      if (oldId) {
        idMap[oldId] = newGame.id;
        console.log(`[IMPORT] Mapped game ID ${oldId} -> ${newGame.id}`);
      }

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

    console.log('[IMPORT] Inserting new lists...');

    // Insert lists and link games
    for (const list of data.lists) {
      const { games: listGames = [], id: oldListId, ...listData } = list; // Remove old list ID

      // Create new list with autoincremented ID
      const newList = await List.create(listData, { transaction });
      
      console.log(`[IMPORT] Created list "${newList.name}" with ID ${newList.id}` + (oldListId ? ` (mapped from ${oldListId})` : ''));

      // Link games via ListItem using the ID map
      for (const entry of listGames) {
        // Find the new game ID using the mapping
        const newGameId = idMap[entry.id] || entry.id;
        
        // Ensure the game exists in our newly created games
        const gameExists = await Game.findByPk(newGameId, { transaction });
        
        if (gameExists) {
          await ListItem.create(
            { list_id: newList.id, game_id: newGameId },
            { transaction }
          );
        } else {
          console.warn(`[IMPORT] Warning: Game ID ${newGameId} (mapped from ${entry.id}) not found. Skipping list entry.`);
        }
      }
    }

    // Commit transaction
    await transaction.commit();
    console.log('[IMPORT] ✓ Import completed successfully. All IDs reset and autoincrement now starts at 1.');
  } catch (err) {
    // Rollback on any failure
    if (transaction) await transaction.rollback();
    console.error('Failed to import data:', err.message);
    throw new Error(`Failed to import data: ${err.message}`);
  }
}

module.exports = { importData };