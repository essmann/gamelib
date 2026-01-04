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
    console.log('Game object received:', game);

    // Ensure date_added is always set
    game.date_added = game.date_added || new Date().toISOString();

    // Extract poster separately
    const posterBuffer = game.poster instanceof Uint8Array ? Buffer.from(game.poster) : null;
    
    // Create game data object and explicitly exclude id field
    const gameData = Object.keys(game).reduce((acc, key) => {
      if (key !== 'id' && key !== 'poster') {
        acc[key] = game[key];
      }
      return acc;
    }, {});

    console.log('Game data to save (id excluded):', gameData);

    // Create the Game instance - id should be autoincremented
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

    // Return the Game instance as plain object with the new autoincremented ID
    return newGame.toJSON ? newGame.toJSON() : newGame;
  } catch (err) {
    console.error('Failed to add game via Sequelize:', err.message);
    throw new Error(`Failed to add game: ${err.message}`);
  }
}

module.exports = addGame;
