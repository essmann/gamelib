// api/endpoints/addList.ts
const { List } = require('../../sqlite/models/index.js');

/**
 * Adds a new list to the database using Sequelize
 * @param {string} name - Name of the list
 * @returns {Promise<List>} The newly created List instance
 */
async function addList(name) {
  try {
    if (!name) throw new Error('List name is required.');

    const newList = await List.create({ name });

    console.log(`✓ Successfully added list: "${newList.name}" (ID: ${newList.id})`);

    return newList.dataValues;
  } catch (err) {
    console.error('Error adding list via Sequelize:', err.message);
    throw err;
  }
}

module.exports = { addList };
