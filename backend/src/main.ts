import express from "express";
import path from "path";
import db from "./database/connection.js";
import Poster from "./database/models/poster.js";
import Game from "./database/models/game.js";
import User from "./database/models/user/user.js";
import UserGame from "./database/models/user/userGame.js";
import getExternalGames from "./database/endpoints/getExternalGames.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware to parse JSON bodies
app.use(express.json());

// ✅ Optional: simple authentication placeholder
app.use((req, res, next) => {
  // TODO: add real authentication later
  next();
});

// ✅ Test DB connection
(async () => {
  try {
    await Game.sync();
    await Poster.sync();
    await User.sync();
    await UserGame.sync();

    const [result] = await db.query("SHOW DATABASES");
    const [tables] = await db.query("SHOW TABLES");
    console.log("Databases:", result);
    console.log("Tables:", tables);
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

// ✅ Endpoints
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  console.log("Received registration data:", req.body);
  res.json({ message: "User registered successfully!" });
});

app.get("/login", (req, res) => {
  res.send("Login endpoint");
});

app.get("/externalGames", async (req, res) => {
  console.log("Request sent to /externalGames.");
  console.log(`query: ${req.query.search}`);

  try {
    const games = await getExternalGames(req, res);
    res.json(games);
    console.log(`Fetched ${games?.length || 0} games`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch external games." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
