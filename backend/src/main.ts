import express from 'express';
import path from 'path';
import db from './database/connection.js'; // adjust extension or omit if using ts-node
// import dotenv from 'dotenv';

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Example test query
(async () => {
  try {
    const [result, meta] = await db.query('SHOW DATABASES');
    console.log('Databases:', result);
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();

app.get('/', (req , res ) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
