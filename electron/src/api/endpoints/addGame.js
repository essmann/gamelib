// api/endpoints/addGame.ts
const { Game, Poster } = require('../sqlite/models/index');

/**
 * Adds a new game to the database with its poster image using Sequelize
 * @param {Object} game - Game object containing all game details
 * @returns {Promise<Game>} The newly created Game instance
 */
async function addGame(game) {
  try {
    console.log('Adding new game via Sequelize...');

    // Ensure date_added is always set
    game.date_added = game.date_added || new Date().toISOString();

    // Extract poster separately
    const posterBuffer = game.poster instanceof Uint8Array ? Buffer.from(game.poster) : null;
    const { poster, id, ...gameData } = game;

    // Create the Game instance
    const newGame = await Game.create(gameData);

    // If poster exists, create associated Poster
    if (posterBuffer) {
      await Poster.create({
        game_id: newGame.id,
        poster: posterBuffer
      });
      console.log(`Poster added for game ID: ${newGame.id}`);
    } else {
      console.log(`No poster provided for game ID: ${newGame.id}`);
    }

    console.log(`✓ Successfully added game: "${newGame.title}" (ID: ${newGame.id})`);

    // Return the Game instance with poster included if needed
    return newGame;
  } catch (err) {
    console.error('Failed to add game via Sequelize:', err.message);
    throw new Error(`Failed to add game: ${err.message}`);
  }
}

module.exports = addGame;
