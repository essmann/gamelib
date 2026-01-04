# Database API Tests Documentation

## Overview

This test suite provides comprehensive coverage of all database CRUD operations for the gamelib backend. The tests use an in-memory SQLite database with Sequelize ORM, ensuring tests are isolated and run quickly without dependencies on a real database.

## Test Files

### 1. **testSetup.js** - Shared Test Infrastructure
Provides a test database setup utility that:
- Creates an in-memory Sequelize SQLite instance
- Defines all data models (Game, Poster, List, ListItem, Tag)
- Establishes all associations and relationships
- Enables foreign key constraints
- Provides cleanup utilities

**Key Functions:**
- `setupTestDatabase()` - Creates isolated in-memory database
- `teardownTestDatabase(db)` - Closes database connection

### 2. **testGameAPI.test.js** - Game CRUD Operations
**23 Tests** covering:

#### getGames - Fetching Games
- Return empty array when no games exist
- Fetch all games with their posters
- Fetch games without posters
- Return correct count of multiple games

#### addGame - Creating Games
- Add single game without poster
- Add game with poster
- Auto-generate date_added field
- Support all game fields (title, release, description, rating, favorite, genres, developers, publishers, categories, etc.)
- Add multiple games sequentially

#### updateGame - Modifying Games
- Update game title
- Update multiple game fields
- Update game poster
- Handle partial updates
- Not update non-existent games

#### deleteGame - Removing Games
- Delete game by ID
- Cascade delete posters when game is deleted
- Cascade delete list items when game is deleted
- Delete multiple games
- Handle deletion of non-existent games

#### Additional Features
- Favorite game flag (set/update/query)
- Game ratings (decimal support, range queries)

### 3. **testListAPI.test.js** - List CRUD Operations
**24 Tests** covering:

#### getLists - Fetching Lists
- Return empty array when no lists exist
- Fetch all lists with their associated games
- Fetch empty lists with no games
- Return multiple lists in sorted order

#### addList - Creating Lists
- Add new list
- Prevent duplicate list names (unique constraint)
- Add multiple lists sequentially
- Auto-increment list IDs

#### deleteList - Removing Lists
- Delete list by ID
- Cascade delete list items when list is deleted
- Delete multiple lists
- Handle deletion of non-existent lists

#### addToList - Adding Games to Lists
- Add single game to list
- Add multiple games to same list
- Prevent duplicate game in same list (unique constraint)
- Allow same game in different lists
- Fetch game details from list

#### deleteFromList - Removing Games from Lists
- Remove game from list
- Remove one game while keeping others
- Remove game from one list without affecting others
- Handle removal of non-existent games
- Handle cascading deletion when game is deleted

#### Complex Operations
- Manage multiple lists with overlapping games
- Handle empty lists after removing all games

### 4. **testPosterAPI.test.js** - Poster Image Management
**19 Tests** covering:

#### Poster Creation
- Add poster to game
- Handle large binary poster data
- Allow multiple posters per game
- Accept Buffer from Uint8Array

#### Poster Retrieval
- Fetch poster by ID
- Fetch poster with associated game
- Fetch all posters for a game
- Fetch game with first poster

#### Poster Updates
- Update poster data
- Update poster while keeping game_id
- Handle findOrCreate for upsert operations

#### Poster Deletion
- Delete poster
- Delete all posters for a game
- Cascade delete posters when game is deleted
- Handle deletion of non-existent posters

#### Data Integrity
- Prevent poster from referencing non-existent game (when enforced)
- Maintain poster-game relationship after game update
- Preserve exact binary data in poster
- Handle null/undefined poster values

## Running the Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test -- testGameAPI.test.js
npm test -- testListAPI.test.js
npm test -- testPosterAPI.test.js
```

### Run Multiple Test Suites
```bash
npm test -- "testGameAPI|testListAPI|testPosterAPI"
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Run in Watch Mode
```bash
npm test -- --watch
```

## Database Schema

The in-memory test database includes:

### Games Table
```sql
CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  release TEXT,
  description TEXT,
  rating REAL,
  favorite INTEGER,
  isCustom INTEGER,
  date_added TEXT,
  genres TEXT,
  developers TEXT,
  publishers TEXT,
  categories TEXT
);
```

### Posters Table
```sql
CREATE TABLE posters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  poster BLOB NOT NULL,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
```

### Lists Table
```sql
CREATE TABLE lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
```

### List Items Table (Many-to-Many)
```sql
CREATE TABLE list_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id INTEGER NOT NULL,
  game_id INTEGER NOT NULL,
  UNIQUE(list_id, game_id),
  FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
```

### Associations
- **Game → Poster** (One-to-Many): `Game.hasMany(Poster, {as: 'Posters'})`
- **List → ListItem** (One-to-Many): `List.hasMany(ListItem, {as: 'Items'})`
- **Game → ListItem** (One-to-Many): `Game.hasMany(ListItem, {as: 'ListItems'})`
- **Game ↔ List** (Many-to-Many): Through `ListItem` junction table

## Key Testing Patterns

### 1. In-Memory Database Isolation
Each test gets a fresh, isolated database:
```javascript
beforeEach(async () => {
  db = await setupTestDatabase();
});

afterEach(async () => {
  await teardownTestDatabase(db);
});
```

### 2. CRUD Operation Testing
Every API endpoint is tested for:
- **Create**: Single items, multiple items, with and without relations
- **Read**: Individual records, all records, with associations
- **Update**: Single fields, multiple fields, partial updates
- **Delete**: By ID, cascade deletions, non-existent records

### 3. Constraint Validation
Tests verify:
- Unique constraints (e.g., list names)
- Foreign key constraints
- Data type handling
- Edge cases (null, empty arrays)

### 4. Relationship Integrity
Tests ensure:
- Cascade deletions work properly
- Associations are maintained
- Cross-references are correct
- No orphaned records

## Test Execution Statistics

- **Total Test Files**: 3 new comprehensive suites
- **Total Tests**: 66 tests
- **Execution Time**: ~1.7 seconds
- **Coverage**: Complete CRUD operations for Games, Lists, and Posters

## Example Test Structure

```javascript
describe('Test Category', () => {
  let db;

  beforeEach(async () => {
    db = await setupTestDatabase();
  });

  afterEach(async () => {
    await teardownTestDatabase(db);
  });

  test('should perform specific operation', async () => {
    // Arrange: Set up test data
    const game = await db.Game.create({
      title: 'Test Game',
      release: '2025-01-01',
      favorite: 0,
      date_added: new Date().toISOString()
    });

    // Act: Perform the operation
    const result = await db.Game.findByPk(game.id);

    // Assert: Verify the result
    expect(result.title).toBe('Test Game');
  });
});
```

## Notes

- Tests use Sequelize ORM with SQLite
- All tests run in-memory, no file I/O
- Foreign key constraints are enabled (`PRAGMA foreign_keys = ON`)
- Tests are isolated and can run in any order
- Binary data (poster images) is preserved exactly
- Cascade deletions are properly tested

## Future Enhancements

Potential areas for additional testing:
- Bulk operations
- Transaction handling
- Performance/stress testing
- Error handling edge cases
- Custom field validation
- Search and filter operations
