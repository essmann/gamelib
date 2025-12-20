// api/endpoints/updateGame.ts
const { Game, Poster } = require('../sqlite/models/index');

/**
 * Updates a game and its poster using Sequelize
 * @param {Object} game - Game object with updated fields (must include `id`)
 * @returns {Promise<Game>} The updated Game instance
 */
async function updateGame(game) {
  try {
    if (!game.id) throw new Error('Game ID is required to update.');

    console.log(`Updating game with ID: ${game.id} via Sequelize...`);

    // Update the Game fields
    const [updatedRows] = await Game.update(
      {
        title: game.title,
        release: game.release,
        description: game.description,
        rating: game.rating,
        favorite: game.favorite,
        date_added: game.date_added
      },
      {
        where: { id: game.id }
      }
    );

    console.log(`Game updated: ${updatedRows} row(s)`);

    // If poster exists, update it
    if (game.poster) {
      const posterBuffer =
        game.poster instanceof Uint8Array ? Buffer.from(game.poster) : game.poster;

      // Upsert Poster (update if exists, create if missing)
      const [poster, created] = await Poster.findOrCreate({
        where: { game_id: game.id },
        defaults: { poster: posterBuffer }
      });

      if (!created) {
        // Poster already exists, update it
        await poster.update({ poster: posterBuffer });
        console.log(`Poster updated for game ID: ${game.id}`);
      } else {
        console.log(`Poster created for game ID: ${game.id}`);
      }
    }

    // Return updated Game instance
    const updatedGame = await Game.findByPk(game.id, {
      include: [{ model: Poster, as: 'Posters' }]
    });

    return updatedGame;
  } catch (err) {
    console.error('Error updating game via Sequelize:', err.message);
    throw err;
  }
}

module.exports = { updateGame };
