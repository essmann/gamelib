// api/endpoints/deleteGame.ts
const { Game } = require('../sqlite/models/index');

/**
 * Deletes a game (and its associated posters via CASCADE) using Sequelize
 * @param {number} id - The ID of the game to delete
 * @returns {Promise<number>} Number of rows deleted
 */
async function deleteGame(id) {
  try {
    if (!id) throw new Error('Game ID is required to delete.');

    console.log(`Deleting game with ID: ${id} via Sequelize...`);

    // Delete the game; associated posters are deleted automatically if onDelete: 'CASCADE' is set
    const deletedRows = await Game.destroy({
      where: { id }
    });

    console.log(`Deleted game with ID ${id}. Rows affected: ${deletedRows}`);

    return deletedRows;
  } catch (err) {
    console.error('Error deleting game via Sequelize:', err.message);
    throw err;
  }
}

module.exports = { deleteGame };
