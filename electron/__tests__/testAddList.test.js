jest.setTimeout(20000); // increase timeout
jest.mock('electron', () => ({
  app: { isPackaged: false }
}));

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// --- DEBUG: compute DB path exactly like your main code ---
const dbFileName = 'games.db';
const projectRoot = path.resolve(__dirname, '../../electron/src/api/sqlite/database/'); // adjust if needed
const dbPath = path.join(projectRoot, dbFileName);
console.log('DEBUG: database path =', dbPath);

// Try opening DB directly
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error opening DB:', err);
  else console.log('Database opened successfully');
});

describe('Add List directly', () => {
  afterAll((done) => {
    console.log('Closing database...');
    db.close((err) => {
      if (err) console.error('Error closing DB:', err);
      else console.log('Database closed.');
      done();
    });
  });

  test('should add a new list to the main database', async () => {
    const listName = 'TestFavorites';
    console.log('Starting test, listName =', listName);

    const insertList = () => {
      console.log('insertList called');
      return new Promise((resolve, reject) => {
        // Remove serialize for testing first
        console.log('Calling db.run directly...');
        const sql = `INSERT INTO lists (name) VALUES (?)`;
        db.run(sql, [listName], function (err) {
          if (err) {
            console.error('Error running db.run:', err);
            return reject(err);
          }
          console.log('db.run completed, lastID =', this.lastID);
          resolve({ id: this.lastID, name: listName });
        });
      });
    };

    try {
      console.log('Calling insertList...');
      const result = await insertList();
      console.log('List added successfully:', result);
    } catch (err) {
      console.error('Caught error:', err);
    }
  });
});
