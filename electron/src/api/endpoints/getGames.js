// api/endpoints/getGames.ts
const { Game, Poster } = require('../sqlite/models/index');

export async function getGames() {
  try {
    console.log('[getGames] Fetching all games with posters...');

    const games = await Game.findAll({
      include: [
        {
          model: Poster,
          as: 'Posters',              // MUST match association alias
          attributes: ['id', 'poster'],
          required: false             // LEFT JOIN
        }
      ]
    });

    console.log(`[getGames] Fetched ${games.length} game(s)`);

    const result = games.map((game) => {
      const gameData = game.toJSON();

      // Safely grab first poster (if any)
      const poster =
        Array.isArray(gameData.Posters) && gameData.Posters.length > 0
          ? gameData.Posters[0]
          : null;

      return {
        id: gameData.id,
        title: gameData.title,
        release: gameData.release,
        description: gameData.description,
        rating: gameData.rating,
        favorite: gameData.favorite,
        isCustom: gameData.isCustom,
        date_added: gameData.date_added,
        genres: gameData.genres,
        developers: gameData.developers,
        publishers: gameData.publishers,
        categories: gameData.categories,
        poster_id: poster ? poster.id : null,
        poster: poster ? poster.poster : null
      };
    });

    // Clean logging (no huge buffers)
    if (result.length > 0) {
      console.log('[getGames] Sample game:', {
        ...result[0],
        poster: result[0].poster
          ? `<Buffer ${result[0].poster.length} bytes>`
          : null
      });
    }

    return result;

  } catch (err) {
    console.error('[getGames] Failed:', err);
    throw err; // let IPC handler deal with it
  }
}
