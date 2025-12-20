// api/endpoints/addToList.ts
const { List, Game, ListItem } = require('../../sqlite/models/index.js');

/**
 * Adds a game to a list (many-to-many) using Sequelize
 * Ignores if the game is already in the list
 * @param {number} listId - ID of the list
 * @param {number} gameId - ID of the game
 * @returns {Promise<Object>} Info about the added relation
 */
async function addToList(listId, gameId) {
  try {
    if (!listId || !gameId) throw new Error('Both listId and gameId are required.');

    // Use findOrCreate to mimic "INSERT OR IGNORE"
    const [item, created] = await ListItem.findOrCreate({
      where: { list_id: listId, game_id: gameId }
    });

    console.log(
      created
        ? `Added game ${gameId} to list ${listId}`
        : `Game ${gameId} already in list ${listId}, ignored`
    );

    return {
      id: item.id,
      listId,
      gameId,
      created
    };
  } catch (err) {
    console.error('Error adding game to list via Sequelize:', err.message);
    throw err;
  }
}

module.exports = { addToList };
