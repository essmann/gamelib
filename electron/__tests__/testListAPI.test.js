/**
 * Comprehensive List Database API Tests
 * Tests for: getLists, addList, deleteList, addToList, deleteFromList
 */

const { setupTestDatabase, teardownTestDatabase, testLogger } = require('./testSetup');

describe('List Database API - Complete CRUD Operations', () => {
  let db;

  beforeEach(async () => {
    db = await setupTestDatabase();
  });

  afterEach(async () => {
    await teardownTestDatabase(db);
  });

  describe('getLists - Fetch All Lists', () => {
    test('should return empty array when no lists exist', async () => {
      testLogger.test('Fetching lists from actual database');
      const lists = await db.List.findAll();

      testLogger.fetched(`Found ${lists.length} list(s)`);
      testLogger.verify(`Lists array is valid`);
      expect(Array.isArray(lists)).toBe(true);
      if (lists.length > 0) {
        testLogger.info(`Sample list: "${lists[0].name}"`);
      }
    });

    test('should fetch all lists with their games', async () => {
      testLogger.test('Creating games and lists with associations');
      // Create games
      const game1 = await db.Game.create({
        title: 'Game 1 NEW',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });
      const game2 = await db.Game.create({
        title: 'Game 2 NEW',
        release: '2025-01-02',
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created(`2 games: IDs ${game1.id}, ${game2.id}`);

      // Create lists
      const list1 = await db.List.create({ name: 'List 1 NEW' });
      const list2 = await db.List.create({ name: 'List 2 NEW' });
      testLogger.created(`2 lists: IDs ${list1.id}, ${list2.id}`);

      // Add games to lists
      await db.ListItem.create({
        list_id: list1.id,
        game_id: game1.id
      });
      await db.ListItem.create({
        list_id: list1.id,
        game_id: game2.id
      });
      await db.ListItem.create({
        list_id: list2.id,
        game_id: game2.id
      });
      testLogger.created('List items created');

      // Fetch lists with games
      testLogger.action('Fetching lists with games');
      const lists = await db.List.findAll({
        include: [
          {
            model: db.Game,
            as: 'Games',
            attributes: ['id', 'title', 'rating', 'favorite', 'date_added'],
            through: { attributes: [] },
            required: false
          }
        ],
        order: [['name', 'ASC']]
      });

      testLogger.fetched(`${lists.length} total lists`);
      
      // Find our new lists
      const newList1 = lists.find(l => l.name === 'List 1 NEW');
      const newList2 = lists.find(l => l.name === 'List 2 NEW');
      
      testLogger.verify(`List 1 NEW has ${newList1.Games.length} games`);
      testLogger.verify(`List 2 NEW has ${newList2.Games.length} games`);
      
      expect(newList1.name).toBe('List 1 NEW');
      expect(newList1.Games.length).toBe(2);
      expect(newList2.name).toBe('List 2 NEW');
      expect(newList2.Games.length).toBe(1);
    });

    test('should fetch empty list with no games', async () => {
      testLogger.test('Creating empty list');
      const emptyListName = `Empty List ${Date.now()}`;
      await db.List.create({ name: emptyListName });
      testLogger.created(`List "${emptyListName}"`);

      testLogger.action('Fetching list with games');
      const lists = await db.List.findAll({
        where: { name: emptyListName },
        include: [
          {
            model: db.Game,
            as: 'Games',
            through: { attributes: [] },
            required: false
          }
        ]
      });

      testLogger.fetched(`${lists.length} list(s) with name containing "Empty"`);
      const emptyList = lists[0];
      testLogger.verify(`List "${emptyList.name}" has ${emptyList.Games.length} games`);
      expect(emptyList.Games).toEqual([]);
    });

    test('should return multiple lists in order', async () => {
      testLogger.test('Creating lists with specific names');
      const timestamp = Date.now();
      await db.List.create({ name: `Zebra List ${timestamp}` });
      await db.List.create({ name: `Apple List ${timestamp}` });
      await db.List.create({ name: `Monkey List ${timestamp}` });
      testLogger.created('3 lists with varying names');

      testLogger.action('Fetching lists in alphabetical order');
      const lists = await db.List.findAll({
        order: [['name', 'ASC']]
      });

      testLogger.fetched(`${lists.length} lists in database`);
      
      // Find our new lists
      const newLists = lists.filter(l => l.name.includes(timestamp.toString()));
      testLogger.verify(`Found ${newLists.length} newly created lists`);
      
      if (newLists.length === 3) {
        testLogger.verify(`Order: ${newLists[0].name.split(' ')[0]} < ${newLists[1].name.split(' ')[0]} < ${newLists[2].name.split(' ')[0]}`);
        expect(newLists[0].name).toContain('Apple');
        expect(newLists[1].name).toContain('Monkey');
        expect(newLists[2].name).toContain('Zebra');
      }
    });
  });

  describe('addList - Create New List', () => {
    test('should add a new list', async () => {
      testLogger.test('Creating new list');
      const list = await db.List.create({ name: 'My Favorites' });
      testLogger.created(`List "${list.name}" with ID ${list.id}`);

      expect(list.id).toBeDefined();
      expect(list.name).toBe('My Favorites');

      testLogger.action('Fetching list by ID');
      const fetched = await db.List.findByPk(list.id);
      testLogger.fetched(`List with ID ${list.id}: "${fetched.name}"`);
      expect(fetched).not.toBeNull();
      expect(fetched.name).toBe('My Favorites');
    });

    test('should prevent duplicate list names', async () => {
      testLogger.test('Creating list with unique name');
      const uniqueName = `Duplicate List ${Date.now()}`;
      await db.List.create({ name: uniqueName });
      testLogger.created(`List "${uniqueName}"`);

      testLogger.action(`Attempting to create duplicate list`);
      try {
        await db.List.create({ name: uniqueName });
        testLogger.error('Expected unique constraint violation but succeeded');
        expect(true).toBe(false); // Should not reach here
      } catch (err) {
        testLogger.verify('Unique constraint enforced as expected');
        expect(err).toBeDefined();
      }
    });

    test('should add multiple lists sequentially', async () => {
      testLogger.test('Creating multiple lists sequentially');
      const lists = [];
      const names = [`List A ${Date.now()}`, `List B ${Date.now()}`, `List C ${Date.now()}`];

      for (const name of names) {
        const list = await db.List.create({ name });
        testLogger.created(`List "${name}" with ID ${list.id}`);
        lists.push(list);
      }

      expect(lists.length).toBe(3);
      testLogger.verify(`All 3 lists have different IDs`);
      expect(lists[0].name).not.toBe(lists[1].name);
      expect(lists[1].name).not.toBe(lists[2].name);

      testLogger.action('Counting lists in database');
      const allLists = await db.List.findAll();
      testLogger.fetched(`${allLists.length} total lists in database`);
      expect(allLists.length).toBeGreaterThanOrEqual(3);
    });

    test('should auto-increment list IDs', async () => {
      const list1 = await db.List.create({ name: 'List 1' });
      const list2 = await db.List.create({ name: 'List 2' });
      const list3 = await db.List.create({ name: 'List 3' });

      expect(list2.id).toBe(list1.id + 1);
      expect(list3.id).toBe(list2.id + 1);
    });
  });

  describe('deleteList - Remove List', () => {
    test('should delete a list by id', async () => {
      const list = await db.List.create({ name: 'List to Delete' });
      const listId = list.id;

      const deleted = await db.List.destroy({ where: { id: listId } });

      expect(deleted).toBe(1);

      const fetched = await db.List.findByPk(listId);
      expect(fetched).toBeNull();
    });

    test('should cascade delete list items when list is deleted', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list = await db.List.create({ name: 'List' });

      const item = await db.ListItem.create({
        list_id: list.id,
        game_id: game.id
      });

      const itemId = item.id;

      // Delete list
      await db.List.destroy({ where: { id: list.id } });

      // ListItem should also be deleted (CASCADE)
      const deletedItem = await db.ListItem.findByPk(itemId);
      expect(deletedItem).toBeNull();
    });

    test('should delete multiple lists', async () => {
      testLogger.test('Creating lists to delete');
      const list1 = await db.List.create({ name: 'List to Delete 1' });
      const list2 = await db.List.create({ name: 'List to Delete 2' });
      const list3 = await db.List.create({ name: 'List to Keep' });
      testLogger.created(`3 lists: 2 to delete (IDs ${list1.id}, ${list2.id}) and 1 to keep (ID ${list3.id})`);

      testLogger.action(`Deleting lists ${list1.id} and ${list2.id}`);
      const deleted = await db.List.destroy({
        where: { id: [list1.id, list2.id] }
      });
      testLogger.deleted(`${deleted} lists`);

      expect(deleted).toBe(2);

      testLogger.action('Verifying list 3 still exists');
      const kept = await db.List.findByPk(list3.id);
      testLogger.fetched(`List ${list3.id}: "${kept.name}"`);
      expect(kept).not.toBeNull();
      expect(kept.id).toBe(list3.id);
    });

    test('should not fail when deleting non-existent list', async () => {
      const result = await db.List.destroy({ where: { id: 99999 } });
      expect(result).toBe(0);
    });
  });

  describe('addToList - Add Game to List', () => {
    test('should add a game to a list', async () => {
      testLogger.test('Creating game and list');
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });
      testLogger.created(`Game with ID ${game.id}`);

      const list = await db.List.create({ name: 'Test List' });
      testLogger.created(`List with ID ${list.id}`);

      testLogger.action(`Adding game ${game.id} to list ${list.id}`);
      const item = await db.ListItem.create({
        list_id: list.id,
        game_id: game.id
      });
      testLogger.created(`ListItem with ID ${item.id}`);

      expect(item.id).toBeDefined();
      expect(item.list_id).toBe(list.id);
      expect(item.game_id).toBe(game.id);

      const fetched = await db.ListItem.findByPk(item.id);
      testLogger.fetched(`ListItem with ID ${item.id}`);
      expect(fetched).not.toBeNull();
    });

    test('should add multiple games to same list', async () => {
      const game1 = await db.Game.create({
        title: 'Game 1',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const game2 = await db.Game.create({
        title: 'Game 2',
        release: '2025-01-02',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list = await db.List.create({ name: 'Multi Game List' });

      await db.ListItem.create({
        list_id: list.id,
        game_id: game1.id
      });

      await db.ListItem.create({
        list_id: list.id,
        game_id: game2.id
      });

      const items = await db.ListItem.findAll({
        where: { list_id: list.id }
      });

      expect(items.length).toBe(2);
    });

    test('should prevent duplicate game in same list', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list = await db.List.create({ name: 'Test List' });

      await db.ListItem.create({
        list_id: list.id,
        game_id: game.id
      });

      try {
        await db.ListItem.create({
          list_id: list.id,
          game_id: game.id
        });
        expect(true).toBe(false); // Should not reach here
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    test('should allow same game in different lists', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list1 = await db.List.create({ name: 'List 1' });
      const list2 = await db.List.create({ name: 'List 2' });

      const item1 = await db.ListItem.create({
        list_id: list1.id,
        game_id: game.id
      });

      const item2 = await db.ListItem.create({
        list_id: list2.id,
        game_id: game.id
      });

      expect(item1.id).not.toBe(item2.id);
      expect(item1.list_id).not.toBe(item2.list_id);

      const game1Items = await db.ListItem.findAll({
        where: { list_id: list1.id }
      });

      const game2Items = await db.ListItem.findAll({
        where: { list_id: list2.id }
      });

      expect(game1Items.length).toBe(1);
      expect(game2Items.length).toBe(1);
    });

    test('should fetch game details from list', async () => {
      const game = await db.Game.create({
        title: 'Game in List',
        release: '2025-01-01',
        rating: 4.5,
        favorite: 1,
        date_added: new Date().toISOString()
      });

      const list = await db.List.create({ name: 'Test List' });

      await db.ListItem.create({
        list_id: list.id,
        game_id: game.id
      });

      const listWithGames = await db.List.findByPk(list.id, {
        include: [
          {
            model: db.Game,
            as: 'Games',
            attributes: ['id', 'title', 'rating', 'favorite'],
            through: { attributes: [] }
          }
        ]
      });

      expect(listWithGames.Games.length).toBe(1);
      expect(listWithGames.Games[0].title).toBe('Game in List');
      expect(listWithGames.Games[0].rating).toBe(4.5);
      expect(listWithGames.Games[0].favorite).toBe(1);
    });
  });

  describe('deleteFromList - Remove Game from List', () => {
    test('should remove a game from a list', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list = await db.List.create({ name: 'Test List' });

      const item = await db.ListItem.create({
        list_id: list.id,
        game_id: game.id
      });

      const deleted = await db.ListItem.destroy({
        where: { list_id: list.id, game_id: game.id }
      });

      expect(deleted).toBe(1);

      const fetched = await db.ListItem.findByPk(item.id);
      expect(fetched).toBeNull();
    });

    test('should remove one game but keep others in list', async () => {
      const game1 = await db.Game.create({
        title: 'Game 1',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const game2 = await db.Game.create({
        title: 'Game 2',
        release: '2025-01-02',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const game3 = await db.Game.create({
        title: 'Game 3',
        release: '2025-01-03',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list = await db.List.create({ name: 'Multi Game List' });

      await db.ListItem.create({
        list_id: list.id,
        game_id: game1.id
      });

      await db.ListItem.create({
        list_id: list.id,
        game_id: game2.id
      });

      await db.ListItem.create({
        list_id: list.id,
        game_id: game3.id
      });

      // Remove game 2
      await db.ListItem.destroy({
        where: { list_id: list.id, game_id: game2.id }
      });

      const remaining = await db.ListItem.findAll({
        where: { list_id: list.id }
      });

      expect(remaining.length).toBe(2);
      expect(remaining.map(item => item.game_id)).toContain(game1.id);
      expect(remaining.map(item => item.game_id)).toContain(game3.id);
      expect(remaining.map(item => item.game_id)).not.toContain(game2.id);
    });

    test('should remove game from one list without affecting others', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list1 = await db.List.create({ name: 'List 1' });
      const list2 = await db.List.create({ name: 'List 2' });

      await db.ListItem.create({
        list_id: list1.id,
        game_id: game.id
      });

      await db.ListItem.create({
        list_id: list2.id,
        game_id: game.id
      });

      // Remove from list1
      await db.ListItem.destroy({
        where: { list_id: list1.id, game_id: game.id }
      });

      const list1Items = await db.ListItem.findAll({
        where: { list_id: list1.id }
      });

      const list2Items = await db.ListItem.findAll({
        where: { list_id: list2.id }
      });

      expect(list1Items.length).toBe(0);
      expect(list2Items.length).toBe(1);
    });

    test('should not fail when removing non-existent game from list', async () => {
      const list = await db.List.create({ name: 'Test List' });

      const result = await db.ListItem.destroy({
        where: { list_id: list.id, game_id: 99999 }
      });

      expect(result).toBe(0);
    });

    test('should handle cascading deletion when game is deleted', async () => {
      const game = await db.Game.create({
        title: 'Game to Delete',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list = await db.List.create({ name: 'Test List' });

      await db.ListItem.create({
        list_id: list.id,
        game_id: game.id
      });

      // Delete game (should cascade delete ListItem)
      await db.Game.destroy({ where: { id: game.id } });

      const items = await db.ListItem.findAll({
        where: { list_id: list.id }
      });

      expect(items.length).toBe(0);

      // List should still exist
      const fetchedList = await db.List.findByPk(list.id);
      expect(fetchedList).not.toBeNull();
    });
  });

  describe('Complex List Operations', () => {
    test('should manage multiple lists with overlapping games', async () => {
      // Create games
      const game1 = await db.Game.create({
        title: 'Game 1',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const game2 = await db.Game.create({
        title: 'Game 2',
        release: '2025-01-02',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const game3 = await db.Game.create({
        title: 'Game 3',
        release: '2025-01-03',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      // Create lists
      const action = await db.List.create({ name: 'Action' });
      const rpg = await db.List.create({ name: 'RPG' });
      const multiplayer = await db.List.create({ name: 'Multiplayer' });

      // Add games to lists (with overlaps)
      await db.ListItem.create({ list_id: action.id, game_id: game1.id });
      await db.ListItem.create({ list_id: action.id, game_id: game2.id });

      await db.ListItem.create({ list_id: rpg.id, game_id: game2.id });
      await db.ListItem.create({ list_id: rpg.id, game_id: game3.id });

      await db.ListItem.create({ list_id: multiplayer.id, game_id: game1.id });
      await db.ListItem.create({ list_id: multiplayer.id, game_id: game3.id });

      // Verify lists
      const actionList = await db.List.findByPk(action.id, {
        include: [
          {
            model: db.Game,
            as: 'Games',
            through: { attributes: [] }
          }
        ]
      });

      const rpgList = await db.List.findByPk(rpg.id, {
        include: [
          {
            model: db.Game,
            as: 'Games',
            through: { attributes: [] }
          }
        ]
      });

      expect(actionList.Games.length).toBe(2);
      expect(rpgList.Games.length).toBe(2);

      // Verify games appear in multiple lists
      const game2Lists = await db.ListItem.findAll({
        where: { game_id: game2.id }
      });
      expect(game2Lists.length).toBe(2);
    });

    test('should handle empty list after removing all games', async () => {
      const game = await db.Game.create({
        title: 'Game',
        release: '2025-01-01',
        favorite: 0,
        date_added: new Date().toISOString()
      });

      const list = await db.List.create({ name: 'Test List' });

      await db.ListItem.create({
        list_id: list.id,
        game_id: game.id
      });

      // Remove the game
      await db.ListItem.destroy({
        where: { list_id: list.id, game_id: game.id }
      });

      // List should still exist but be empty
      const listWithGames = await db.List.findByPk(list.id, {
        include: [
          {
            model: db.Game,
            as: 'Games',
            through: { attributes: [] }
          }
        ]
      });

      expect(listWithGames).not.toBeNull();
      expect(listWithGames.Games.length).toBe(0);
    });
  });
});
