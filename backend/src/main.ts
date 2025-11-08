import express from "express";
import path from "path";
import db from "./database/connection.js"; // adjust extension or omit if using ts-node
// import dotenv from 'dotenv';

// dotenv.config();
import Poster from "./database/models/poster.js";
import Game from "./database/models/game.js";

//types
import GameResponse from "./database/models/DTO/gameResponse.js";

//endpoint handlers
import getExternalGames from "./database/endpoints/getExternalGames.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Example test query
(async () => {
  try {
    await Game.sync();
    await Poster.sync();

    const [result, meta] = await db.query("SHOW DATABASES");
    const [tables] = await db.query("SHOW TABLES");
    console.log("Databases:", result);
    console.log("Tables:", tables);
    console.log("Database connected successfully.");

    
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

app.get("/", (req, res) => {
  res.send("Hello World!");

});

app.get("/externalGames", async (req, res) =>{
 let games = await getExternalGames(req, res);
 res.setHeader("Content-Type", "application/json");
 res.end(JSON.stringify(games, null, 2));
  
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
