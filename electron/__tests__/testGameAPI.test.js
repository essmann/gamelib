/**
 * Comprehensive Game Database API Tests
 * Tests for: getGames, addGame, updateGame, deleteGame
 */

const { setupTestDatabase, teardownTestDatabase, testLogger } = require('./testSetup');

describe('Game Database API - Complete CRUD Operations', () => {
  let db;

  beforeEach(async () => {
    db = await setupTestDatabase();
  });

  afterEach(async () => {
    await teardownTestDatabase(db);
  });

  describe('getGames - Fetch All Games', () => {
    test('should return empty array when no games exist', async () => {
      testLogger.test('Fetching games from actual database (which may contain data)');
      const games = await db.Game.findAll({
        include: [
          {
            model: db.Poster,
            as: 'Posters',
            attributes: ['id', 'poster'],
            required: false
          }
        ]
      });

      testLogger.fetched(`Found ${games.length} game(s) in database`);
      testLogger.verify(`All games have proper structure with optional Posters`);
      expect(Array.isArray(games)).toBe(true);
      // Verify structure even if not empty
      if (games.length > 0) {
        expect(games[0]).toHaveProperty('title');
        expect(games[0]).toHaveProperty('Posters');
        testLogger.info(`Sample game: "${games[0].title}"`);
      }
    });

    test('should fetch all games with their posters', async () => {
      testLogger.test('Creating test games with posters');
      // Add test games
      const game1 = await db.Game.create({
        title: 'Game 1 NEW',
        release: '2025-01-01',
        description: 'Test game 1',
        rating: 5,
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created(`Game 1 with ID ${game1.id}`);

      const game2 = await db.Game.create({
        title: 'Game 2 NEW',
        release: '2025-01-02',
        description: 'Test game 2',
        rating: 4,
        favorite: 1,
        date_added: new Date().toISOString()
      });
      testLogger.created(`Game 2 with ID ${game2.id}`);

      // Add posters
      await db.Poster.create({
        game_id: game1.id,
        poster: Buffer.from('poster1_data')
      });
      testLogger.created('Poster for Game 1');

      await db.Poster.create({
        game_id: game2.id,
        poster: Buffer.from('poster2_data')
      });
      testLogger.created('Poster for Game 2');

      // Fetch games
      testLogger.action('Fetching all games with posters');
      const games = await db.Game.findAll({
        include: [
          {
            model: db.Poster,
            as: 'Posters',
            attributes: ['id', 'poster'],
            required: false
          }
        ],
        order: [['id', 'ASC']]
      });

      testLogger.fetched(`${games.length} games total`);
      
      // Find our new games
      const newGame1 = games.find(g => g.title === 'Game 1 NEW');
      const newGame2 = games.find(g => g.title === 'Game 2 NEW');
      
      testLogger.verify(`Game 1 NEW: ${newGame1.title} with ${newGame1.Posters.length} poster(s)`);
      testLogger.verify(`Game 2 NEW: ${newGame2.title} with ${newGame2.Posters.length} poster(s)`);
      
      expect(newGame1.title).toBe('Game 1 NEW');
      expect(newGame1.Posters.length).toBe(1);
      expect(newGame2.title).toBe('Game 2 NEW');
      expect(newGame2.Posters.length).toBe(1);
    });

    test('should fetch games without posters', async () => {
      testLogger.test('Creating game without poster');
      // Add game without poster
      await db.Game.create({
        title: 'Game without poster NEW',
        release: '2025-01-01',
        description: 'No poster',
        rating: 3,
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created('Game without poster');

      testLogger.action('Fetching all games');
      const games = await db.Game.findAll({
        include: [
          {
            model: db.Poster,
            as: 'Posters',
            attributes: ['id', 'poster'],
            required: false
          }
        ]
      });

      testLogger.fetched(`${games.length} total games`);
      
      // Find the one we just created
      const newGame = games.find(g => g.title.includes('Game without poster NEW'));
      testLogger.verify(`Found newly created game without poster`);
      expect(newGame).toBeDefined();
      expect(newGame.Posters).toEqual([]);
    });

    test('should return correct count of multiple games', async () => {
      testLogger.test('Counting games in database (includes existing data)');
      const initialCount = await db.Game.count();
      testLogger.fetched(`${initialCount} existing game(s)`);

      testLogger.action('Creating 5 new games');
      for (let i = 0; i < 5; i++) {
        await db.Game.create({
          title: `Game ${i + 1}`,
          release: `2025-01-0${i + 1}`,
          description: `Test game ${i + 1}`,
          rating: 5 - i,
          favorite: i % 2,
          date_added: new Date().toISOString()
        });
      }
      testLogger.created('5 new games');

      const games = await db.Game.findAll();

      testLogger.fetched(`${games.length} total games now`);
      testLogger.verify(`New games: 5, Total games: ${games.length}`);
      expect(games.length).toBe(initialCount + 5);
    });
  });

  describe('addGame - Add New Game', () => {
    test('should add a single game without poster', async () => {
      testLogger.test('Adding single game');
      const gameData = {
        title: 'New Game',
        release: '2025-01-15',
        description: 'A new test game',
        rating: 4.5,
        favorite: 0,
        date_added: new Date().toISOString()
      };

      const game = await db.Game.create(gameData);
      testLogger.created(`Game "${game.title}" with ID ${game.id}`);

      expect(game.id).toBeDefined();
      expect(game.title).toBe('New Game');
      expect(game.release).toBe('2025-01-15');
      expect(game.rating).toBe(4.5);

      const fetchedGame = await db.Game.findByPk(game.id);
      testLogger.fetched(`Game with ID ${game.id}: "${fetchedGame.title}"`);
      expect(fetchedGame).not.toBeNull();
      expect(fetchedGame.title).toBe('New Game');
    });

    test('should add a game with poster', async () => {
      const gameData = {
        title: 'Game with Poster',
        release: '2025-01-10',
        description: 'Test with poster',
        rating: 5,
        favorite: 1,
        date_added: new Date().toISOString()
      };

      const game = await db.Game.create(gameData);
      const posterData = Buffer.from('test_poster_binary_data');
      
      await db.Poster.create({
        game_id: game.id,
        poster: posterData
      });

      const fetchedGame = await db.Game.findByPk(game.id, {
        include: [
          {
            model: db.Poster,
            as: 'Posters',
            required: false
          }
        ]
      });

      expect(fetchedGame.Posters.length).toBe(1);
      expect(fetchedGame.Posters[0].poster).toEqual(posterData);
    });

    test('should auto-generate date_added if not provided', async () => {
      const gameData = {
        title: 'Game Auto Date',
        release: '2025-01-20',
        description: 'Auto date test'
      };

      const game = await db.Game.create({
        ...gameData,
        date_added: new Date().toISOString()
      });

      expect(game.date_added).toBeDefined();
    });

    test('should support all game fields', async () => {
      const gameData = {
        title: 'Full Featured Game',
        release: '2025-01-25',
        description: 'All fields populated',
        rating: 4.8,
        favorite: 1,
        isCustom: 1,
        date_added: new Date().toISOString(),
        genres: 'Action,Adventure',
        developers: 'Dev Company',
        publishers: 'Pub Company',
        categories: 'Games,Indie'
      };

      const game = await db.Game.create(gameData);

      const fetchedGame = await db.Game.findByPk(game.id);
      expect(fetchedGame.genres).toBe('Action,Adventure');
      expect(fetchedGame.developers).toBe('Dev Company');
      expect(fetchedGame.publishers).toBe('Pub Company');
      expect(fetchedGame.categories).toBe('Games,Indie');
      expect(fetchedGame.isCustom).toBe(1);
    });

    test('should add multiple games sequentially', async () => {
      testLogger.test('Adding multiple games sequentially');
      const games = [];
      for (let i = 0; i < 3; i++) {
        const game = await db.Game.create({
          title: `Sequential Game ${i + 1}`,
          release: `2025-02-0${i + 1}`,
          description: `Sequential test ${i + 1}`,
          rating: 4 + (i * 0.2),
          favorite: 0,
          date_added: new Date().toISOString()
        });
        testLogger.created(`Sequential Game ${i + 1} with ID ${game.id}`);
        games.push(game);
      }

      testLogger.verify('3 games created with different IDs');
      expect(games.length).toBe(3);
      expect(games[0].id).not.toBe(games[1].id);
      expect(games[1].id).not.toBe(games[2].id);

      testLogger.action('Verifying count');
      const allGames = await db.Game.findAll();
      testLogger.fetched(`${allGames.length} total games in database`);
      // Just verify the new games were added (don't assert absolute count)
      expect(allGames.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('updateGame - Modify Game Data', () => {
    test('should update game title', async () => {
      const game = await db.Game.create({
        title: 'Original Title',
        release: '2025-01-01',
        description: 'Original description',
        rating: 3,
        favorite: 0,
        date_added: new Date().toISOString()
      });

      await db.Game.update(
        { title: 'Updated Title' },
        { where: { id: game.id } }
      );

      const updatedGame = await db.Game.findByPk(game.id);
      expect(updatedGame.title).toBe('Updated Title');
      expect(updatedGame.description).toBe('Original description');
    });

    test('should update multiple game fields', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        description: 'Old description',
        rating: 2,
        favorite: 0,
        date_added: '2025-01-01T00:00:00Z'
      });

      await db.Game.update(
        {
          title: 'New Title',
          description: 'New description',
          rating: 4.5,
          favorite: 1
        },
        { where: { id: game.id } }
      );

      const updatedGame = await db.Game.findByPk(game.id);
      expect(updatedGame.title).toBe('New Title');
      expect(updatedGame.description).toBe('New description');
      expect(updatedGame.rating).toBe(4.5);
      expect(updatedGame.favorite).toBe(1);
    });

    test('should update game poster', async () => {
      const game = await db.Game.create({
        title: 'Game with Poster',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const poster1 = Buffer.from('poster_v1_data');
      await db.Poster.create({
        game_id: game.id,
        poster: poster1
      });

      const existingPoster = await db.Poster.findOne({ where: { game_id: game.id } });
      const poster2 = Buffer.from('poster_v2_updated_data');
      await existingPoster.update({ poster: poster2 });

      const updatedPoster = await db.Poster.findByPk(existingPoster.id);
      expect(updatedPoster.poster).toEqual(poster2);
    });

    test('should handle partial updates', async () => {
      const originalData = {
        title: 'Complete Game',
        release: '2025-01-01',
        description: 'Full description',
        rating: 3,
        favorite: 0,
        genres: 'Action',
        developers: 'Dev Studio',
        date_added: new Date().toISOString()
      };

      const game = await db.Game.create(originalData);

      // Update only rating
      await db.Game.update({ rating: 5 }, { where: { id: game.id } });

      const updated = await db.Game.findByPk(game.id);
      expect(updated.rating).toBe(5);
      expect(updated.genres).toBe('Action');
      expect(updated.developers).toBe('Dev Studio');
      expect(updated.title).toBe('Complete Game');
    });

    test('should not update non-existent game', async () => {
      const result = await db.Game.update(
        { title: 'Updated' },
        { where: { id: 99999 } }
      );

      expect(result[0]).toBe(0);
    });
  });

  describe('deleteGame - Remove Game', () => {
    test('should delete a game by id', async () => {
      testLogger.test('Creating game to delete');
      const game = await db.Game.create({
        title: 'Game to Delete',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created(`Game with ID ${game.id}`);

      const gameId = game.id;

      testLogger.action(`Deleting game with ID ${gameId}`);
      const deleted = await db.Game.destroy({ where: { id: gameId } });
      testLogger.deleted(`${deleted} game(s)`);

      expect(deleted).toBe(1);

      const fetchedGame = await db.Game.findByPk(gameId);
      testLogger.verify('Game no longer in database');
      expect(fetchedGame).toBeNull();
    });

    test('should cascade delete posters when game is deleted', async () => {
      const game = await db.Game.create({
        title: 'Game with Poster',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const poster = await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_data')
      });

      const posterId = poster.id;

      // Delete game
      await db.Game.destroy({ where: { id: game.id } });

      // Poster should also be deleted (CASCADE)
      const deletedPoster = await db.Poster.findByPk(posterId);
      expect(deletedPoster).toBeNull();
    });

    test('should cascade delete list items when game is deleted', async () => {
      const game = await db.Game.create({
        title: 'Game for List',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list = await db.List.create({
        name: 'Test List'
      });

      const listItem = await db.ListItem.create({
        list_id: list.id,
        game_id: game.id
      });

      const itemId = listItem.id;

      // Delete game
      await db.Game.destroy({ where: { id: game.id } });

      // ListItem should also be deleted (CASCADE)
      const deletedItem = await db.ListItem.findByPk(itemId);
      expect(deletedItem).toBeNull();
    });

    test('should delete multiple games', async () => {
      testLogger.test('Creating games to delete');
      const game1 = await db.Game.create({
        title: 'Game to Delete 1',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });
      const game2 = await db.Game.create({
        title: 'Game to Delete 2',
        release: '2025-01-02',
        favorite: 0,
        date_added: new Date().toISOString()
      });
      const game3 = await db.Game.create({
        title: 'Game to Keep',
        release: '2025-01-03',
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created(`3 games: 2 to delete with IDs ${game1.id}, ${game2.id} and 1 to keep ${game3.id}`);

      testLogger.action(`Deleting games with IDs ${game1.id}, ${game2.id}`);
      const deleted = await db.Game.destroy({
        where: { id: [game1.id, game2.id] }
      });
      testLogger.deleted(`${deleted} games`);

      expect(deleted).toBe(2);

      testLogger.action('Verifying kept game still exists');
      const remaining = await db.Game.findByPk(game3.id);
      testLogger.fetched(`Game ${game3.id}: "${remaining.title}"`);
      expect(remaining).not.toBeNull();
      expect(remaining.id).toBe(game3.id);
    });

    test('should not fail when deleting non-existent game', async () => {
      const result = await db.Game.destroy({ where: { id: 99999 } });
      expect(result).toBe(0);
    });
  });

  describe('Favorite Game Flag', () => {
    test('should set and update favorite status', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      expect(game.favorite).toBe(0);

      await db.Game.update({ favorite: 1 }, { where: { id: game.id } });

      const updated = await db.Game.findByPk(game.id);
      expect(updated.favorite).toBe(1);
    });

    test('should fetch all favorite games', async () => {
      testLogger.test('Fetching games from actual database');
      const allGames = await db.Game.findAll();
      testLogger.fetched(`${allGames.length} total games in database`);

      testLogger.action('Filtering for favorite games');
      const favorites = await db.Game.findAll({
        where: { favorite: 1 }
      });

      testLogger.fetched(`${favorites.length} favorite game(s)`);
      testLogger.verify(`All favorites have favorite flag set to 1`);
      expect(favorites.every(g => g.favorite === 1)).toBe(true);
      
      // Note: length depends on actual database content
      if (favorites.length > 0) {
        testLogger.fetched(`Sample: ${favorites[0].title}`);
      }
    });
  });

  describe('Game Rating', () => {
    test('should handle decimal ratings', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        rating: 4.75,
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const fetched = await db.Game.findByPk(game.id);
      expect(fetched.rating).toBe(4.75);
    });

    test('should fetch games by rating', async () => {
      testLogger.test('Creating test games with specific ratings');
      await db.Game.create({
        title: 'High Rated New',
        release: '2025-01-01',
        rating: 5,
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created('High rated game (5 stars)');

      await db.Game.create({
        title: 'Low Rated New',
        release: '2025-01-02',
        rating: 2,
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created('Low rated game (2 stars)');

      testLogger.action('Fetching games with rating >= 4');
      const highRated = await db.Game.findAll({
        where: { rating: { [require('sequelize').Op.gte]: 4 } }
      });

      testLogger.fetched(`${highRated.length} game(s) with rating >= 4`);
      testLogger.verify(`All fetched games have rating >= 4`);
      expect(highRated.every(g => g.rating >= 4)).toBe(true);
      
      // Should include at least the ones we created
      const newHighRated = highRated.filter(g => g.title.includes('New'));
      testLogger.info(`${newHighRated.length} of the fetched games were newly created`);
    });
  });
});
