// api/endpoints/deleteFromList.ts
const { ListItem } = require('../../sqlite/models/index.js');

/**
 * Removes a game from a list (many-to-many) using Sequelize
 * @param {number} listId - ID of the list
 * @param {number} gameId - ID of the game
 * @returns {Promise<number>} Number of rows deleted
 */
async function deleteFromList(listId, gameId) {
  try {
    if (!listId || !gameId) throw new Error('Both listId and gameId are required.');

    const deletedRows = await ListItem.destroy({
      where: { list_id: listId, game_id: gameId }
    });

    console.log(`Removed game ${gameId} from list ${listId}. Rows affected: ${deletedRows}`);

    return deletedRows;
  } catch (err) {
    console.error('Error removing game from list via Sequelize:', err.message);
    throw err;
  }
}

module.exports = { deleteFromList };
