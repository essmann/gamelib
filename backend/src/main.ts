import express from "express";
import path from "path";
import dotenv from "dotenv";
import db from "./database/connection.js";
import Poster from "./database/models/poster.js";
import Game from "./database/models/game.js";
import User from "./database/models/user/user.js";
import UserGame from "./database/models/user/userGame.js";
import getExternalGames from "./database/endpoints/getExternalGames.js";
import session from "express-session";
import Session from "./database/models/user/session.js";
import bcrypt from "bcrypt";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SECRET_KEY || "",
    resave: false, // Avoid resaving unchanged sessions
    saveUninitialized: false, // Only save sessions with initialized data
    cookie: {
      maxAge: 60000, // 1-minute session expiry
    },
  })
); // puts a session object in your requests

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
    await User.sync();
    await Session.sync();
    await Game.sync();
    await Poster.sync();
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

app.get("/test", (req, res) => {
  req.session.user = { id: 1, username: "testname" };
  console.log(req.session);
});
app.post("/register", async (req, res) => {
  console.log("Received registration data:", req.body);
  const { username, email, password } = req.body;
  const emailExists =
    (await User.findOne({ where: { email: email } })) === null ? false : true;
  if (emailExists) {
    res.status(409);
    res.json({
      error: "UserAlreadyExists",
      message: "A user with this email already exists.",
    });
  }
  //hash and salt password. Salt rounds = 10.
  bcrypt.hash(password, 10, async function (err, hash) {
      await User.create({

      })
  });
  res.json({ message: "User registered successfully!" });
});

app.post("/login", (req, res) => {
  res.send("Login endpoint");
});
app.get("/logout", (req, res) => {
  res.send("Logout endpoint");
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
