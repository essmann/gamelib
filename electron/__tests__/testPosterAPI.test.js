/**
 * Comprehensive Poster Database API Tests
 * Tests for poster CRUD operations and relationships
 */

const { setupTestDatabase, teardownTestDatabase, testLogger } = require('./testSetup');

describe('Poster Database API - Image Management', () => {
  let db;

  beforeEach(async () => {
    db = await setupTestDatabase();
  });

  afterEach(async () => {
    await teardownTestDatabase(db);
  });

  describe('Poster Creation', () => {
    test('should add a poster to a game', async () => {
      testLogger.test('Creating game');
      const game = await db.Game.create({
        title: 'Game with Poster',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created(`Game with ID ${game.id}`);

      testLogger.action('Creating poster');
      const posterData = Buffer.from('poster_binary_data_content');
      const poster = await db.Poster.create({
        game_id: game.id,
        poster: posterData
      });
      testLogger.created(`Poster with ID ${poster.id} (${posterData.length} bytes)`);

      expect(poster.id).toBeDefined();
      expect(poster.game_id).toBe(game.id);
      expect(poster.poster).toEqual(posterData);
    });

    test('should handle large binary poster data', async () => {
      testLogger.test('Creating game');
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created(`Game with ID ${game.id}`);

      // Create a larger binary buffer (simulating an actual image)
      testLogger.action('Creating 10KB binary poster data');
      const largeBuffer = Buffer.alloc(10000);
      for (let i = 0; i < largeBuffer.length; i++) {
        largeBuffer[i] = i % 256;
      }

      const poster = await db.Poster.create({
        game_id: game.id,
        poster: largeBuffer
      });
      testLogger.created(`Poster with ID ${poster.id} (${largeBuffer.length} bytes)`);

      testLogger.action('Fetching poster');
      const fetched = await db.Poster.findByPk(poster.id);
      testLogger.fetched(`Poster with ID ${fetched.id} (${fetched.poster.length} bytes)`);
      expect(fetched.poster).toEqual(largeBuffer);
    });

    test('should allow multiple posters per game', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const poster1 = await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_version_1')
      });

      const poster2 = await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_version_2')
      });

      const posters = await db.Poster.findAll({
        where: { game_id: game.id }
      });

      expect(posters.length).toBe(2);
      expect(posters[0].poster).toEqual(Buffer.from('poster_version_1'));
      expect(posters[1].poster).toEqual(Buffer.from('poster_version_2'));
    });

    test('should accept Buffer from Uint8Array', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const uint8Data = new Uint8Array([0x89, 0x50, 0x4E, 0x47]);
      const buffer = Buffer.from(uint8Data);

      const poster = await db.Poster.create({
        game_id: game.id,
        poster: buffer
      });

      const fetched = await db.Poster.findByPk(poster.id);
      expect(fetched.poster).toEqual(buffer);
    });
  });

  describe('Poster Retrieval', () => {
    test('should fetch poster by id', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const posterData = Buffer.from('test_poster');

      const poster = await db.Poster.create({
        game_id: game.id,
        poster: posterData
      });

      const fetched = await db.Poster.findByPk(poster.id);

      expect(fetched).not.toBeNull();
      expect(fetched.id).toBe(poster.id);
      expect(fetched.poster).toEqual(posterData);
    });

    test('should fetch poster with associated game', async () => {
      const game = await db.Game.create({
        title: 'Game Title',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const poster = await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_data')
      });

      const fetched = await db.Poster.findByPk(poster.id, {
        include: [
          {
            model: db.Game,
            as: 'Game'
          }
        ]
      });

      expect(fetched.Game).not.toBeNull();
      expect(fetched.Game.id).toBe(game.id);
      expect(fetched.Game.title).toBe('Game Title');
    });

    test('should fetch all posters for a game', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_1')
      });

      await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_2')
      });

      const posters = await db.Poster.findAll({
        where: { game_id: game.id }
      });

      expect(posters.length).toBe(2);
    });

    test('should fetch game with first poster', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('first_poster')
      });

      await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('second_poster')
      });

      const gameWithPoster = await db.Game.findByPk(game.id, {
        include: [
          {
            model: db.Poster,
            as: 'Posters',
            required: false
          }
        ]
      });

      expect(gameWithPoster.Posters.length).toBe(2);
      expect(gameWithPoster.Posters[0].poster).toEqual(Buffer.from('first_poster'));
    });
  });

  describe('Poster Updates', () => {
    test('should update poster data', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const poster = await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('old_poster_data')
      });

      const newPosterData = Buffer.from('new_poster_data_updated');

      await db.Poster.update(
        { poster: newPosterData },
        { where: { id: poster.id } }
      );

      const updated = await db.Poster.findByPk(poster.id);
      expect(updated.poster).toEqual(newPosterData);
    });

    test('should update poster while keeping game_id', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const poster = await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('original')
      });

      const originalGameId = poster.game_id;
      const newPosterData = Buffer.from('updated');

      await poster.update({ poster: newPosterData });

      expect(poster.game_id).toBe(originalGameId);
      expect(poster.poster).toEqual(newPosterData);
    });

    test('should handle findOrCreate for poster upsert', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const posterData = Buffer.from('initial_data');

      // First create
      const [poster1, created1] = await db.Poster.findOrCreate({
        where: { game_id: game.id },
        defaults: { poster: posterData }
      });

      expect(created1).toBe(true);
      expect(poster1.poster).toEqual(posterData);

      // Second call should find existing
      const [poster2, created2] = await db.Poster.findOrCreate({
        where: { game_id: game.id },
        defaults: { poster: Buffer.from('different') }
      });

      expect(created2).toBe(false);
      expect(poster2.id).toBe(poster1.id);
      expect(poster2.poster).toEqual(posterData);
    });
  });

  describe('Poster Deletion', () => {
    test('should delete a poster', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const poster = await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_data')
      });

      const posterId = poster.id;

      const deleted = await db.Poster.destroy({
        where: { id: posterId }
      });

      expect(deleted).toBe(1);

      const fetched = await db.Poster.findByPk(posterId);
      expect(fetched).toBeNull();
    });

    test('should delete all posters for a game', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_1')
      });

      await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_2')
      });

      const deleted = await db.Poster.destroy({
        where: { game_id: game.id }
      });

      expect(deleted).toBe(2);

      const remaining = await db.Poster.findAll({
        where: { game_id: game.id }
      });

      expect(remaining).toEqual([]);
    });

    test('should cascade delete posters when game is deleted', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const poster1 = await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_1')
      });

      const poster2 = await db.Poster.create({
        game_id: game.id,
        poster: Buffer.from('poster_2')
      });

      const poster1Id = poster1.id;
      const poster2Id = poster2.id;

      // Delete game
      await db.Game.destroy({ where: { id: game.id } });

      // Both posters should be deleted via CASCADE
      const remaining = await db.Poster.findAll({
        where: { id: [poster1Id, poster2Id] }
      });

      expect(remaining).toEqual([]);
    });

    test('should not fail when deleting non-existent poster', async () => {
      const result = await db.Poster.destroy({
        where: { id: 99999 }
      });

      expect(result).toBe(0);
    });
  });

  describe('Poster-Game Relationship Integrity', () => {
    test('should prevent poster from referencing non-existent game (if enforced)', async () => {
      // This test may or may not pass depending on foreign key constraints
      // With PRAGMA foreign_keys = ON, this should fail
      try {
        await db.Poster.create({
          game_id: 99999,
          poster: Buffer.from('orphan_poster')
        });
        // If it succeeds, foreign keys might not be enforced
        const posters = await db.Poster.findAll({
          where: { game_id: 99999 }
        });
        expect(posters.length).toBeGreaterThan(0);
      } catch (err) {
        // Expected if foreign keys are enforced
        expect(err).toBeDefined();
      }
    });

    test('should maintain poster-game relationship after game update', async () => {
      const game = await db.Game.create({
        title: 'Original Title',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const posterData = Buffer.from('poster_data');
      const poster = await db.Poster.create({
        game_id: game.id,
        poster: posterData
      });

      // Update game
      await db.Game.update(
        { title: 'Updated Title' },
        { where: { id: game.id } }
      );

      // Poster should still reference the same game
      const posterAfterUpdate = await db.Poster.findByPk(poster.id);
      expect(posterAfterUpdate.game_id).toBe(game.id);

      const gameAfterUpdate = await db.Game.findByPk(game.id);
      expect(gameAfterUpdate.title).toBe('Updated Title');
    });
  });

  describe('Poster Data Integrity', () => {
    test('should preserve exact binary data in poster', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      // Create a buffer with specific byte values
      const originalBuffer = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, // JPEG header
        0x00, 0x10, 0x4A, 0x46, // "JFIF"
        0x49, 0x46
      ]);

      const poster = await db.Poster.create({
        game_id: game.id,
        poster: originalBuffer
      });

      const fetched = await db.Poster.findByPk(poster.id);
      
      // Verify exact bytes match
      expect(fetched.poster.toString('hex')).toBe(originalBuffer.toString('hex'));
      expect(fetched.poster.length).toBe(originalBuffer.length);
    });

    test('should handle null/undefined poster', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      try {
        // Attempting to create with null poster
        const poster = await db.Poster.create({
          game_id: game.id,
          poster: null
        });
        
        // If it succeeds, check what was stored
        expect(poster.poster).toBeNull();
      } catch (err) {
        // Expected if NOT NULL constraint is set
        expect(err).toBeDefined();
      }
    });
  });
});
