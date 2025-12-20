// api/endpoints/getLists.ts
const { List, Game } = require('../../sqlite/models/index.js');

/**
 * Fetch all lists with their associated games using Sequelize
 * @returns {Promise<Array>} Array of lists, each containing an array of games
 */
async function getLists() {
  try {
    const lists = await List.findAll({
      include: [
        {
          model: Game,
          as: 'Games',          // must match the alias in models/index.js
          attributes: ['id', 'title', 'rating', 'favorite', 'date_added'],
          through: { attributes: [] }, // exclude ListItem fields
          required: false       // LEFT JOIN
        }
      ],
      order: [
        ['name', 'ASC'],
        [{ model: Game, as: 'Games' }, 'title', 'ASC']
      ]
    });

    // Transform Sequelize instances into plain objects
    const result = lists.map(list => ({
      id: list.id,
      name: list.name,
      games: list.Games.map(game => ({
        id: game.id,
        title: game.title,
        rating: game.rating,
        favorite: game.favorite,
        date_added: game.date_added
      }))
    }));

    return result;
  } catch (err) {
    console.error('Error fetching lists via Sequelize:', err.message);
    throw err;
  }
}

module.exports = { getLists };
