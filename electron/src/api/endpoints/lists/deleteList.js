// api/endpoints/deleteList.ts
const { List } = require('../../sqlite/models/index.js');

/**
 * Deletes a list and its associated list items using Sequelize
 * @param {number} listId - ID of the list to delete
 * @returns {Promise<number>} Number of rows deleted
 */
async function deleteList(listId) {
  try {
    if (!listId) throw new Error('List ID is required.');

    const deletedRows = await List.destroy({
      where: { id: listId }
    });

    console.log(`Deleted list ${listId}. Rows affected: ${deletedRows}`);

    return deletedRows;
  } catch (err) {
    console.error('Error deleting list via Sequelize:', err.message);
    throw err;
  }
}

module.exports = { deleteList };
