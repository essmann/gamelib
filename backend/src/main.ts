import express from "express";
import dotenv from "dotenv";
import db from "./database/connection.js";

import Official_Poster from "./database/models/official_poster.js";
import Official_Game from "./database/models/official_game.js";
import User from "./database/models/user/user.js";
import UserGame from "./database/models/user/userGame.js";

import getExternalGames from "./database/endpoints/getExternalGames.js";
import addGame from "./database/endpoints/addGame.js";

import session from "express-session";
import bcrypt from "bcrypt";
import login from "./database/endpoints/auth/login.js";
import cors from "cors";
import CustomGame from "./database/models/customGame.js";
import CustomPoster from "./database/models/customPoster.js";
import GameResponse from "./database/models/DTO/game.js";
import getGames from "./database/endpoints/getGames.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const color = {
  red: (msg: string) => `\x1b[31m${msg}\x1b[0m`,
  green: (msg: string) => `\x1b[32m${msg}\x1b[0m`,
  yellow: (msg: string) => `\x1b[33m${msg}\x1b[0m`,
  blue: (msg: string) => `\x1b[34m${msg}\x1b[0m`,
  magenta: (msg: string) => `\x1b[35m${msg}\x1b[0m`,
  cyan: (msg: string) => `\x1b[36m${msg}\x1b[0m`,
  bold: (msg: string) => `\x1b[1m${msg}\x1b[0m`,
};

async function startServer() {
  // Import connect-session-sequelize dynamically
  const SequelizeStoreFactory = (await import("connect-session-sequelize"))
    .default;
  const SequelizeStore = SequelizeStoreFactory(session.Store);

  // Increase the JSON body size limit (adjust as needed)
  app.use(express.json({ limit: "50mb" })); // or '10mb', '100mb', etc.
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Session store
  const store = new SequelizeStore({ db });
  await store.sync();

  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev_secret",
      store,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      },
    })
  );

  // JSON & CORS setup
  app.use(express.json());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );

  // Database setup
  console.log("📊 Syncing database tables...");

  await User.sync();
  console.log("✅ User synced");

  await Official_Game.sync();
  console.log("✅ Official_Game synced");

  await Official_Poster.sync();
  console.log("✅ Official_Poster synced");

  await CustomGame.sync();
  console.log("✅ CustomGame synced");

  await CustomPoster.sync();
  console.log("✅ CustomPoster synced");

  await UserGame.sync();
  console.log("✅ UserGame synced");

  // Seed a test user (safe-fail)
  try {
    const hash = await bcrypt.hash("123", 10);
    await User.create({
      username: "essmann",
      email: "ken@gmail.com",
      password: hash,
    });
  } catch {}

  console.log("✅ Database connected and synced");

  // ROUTES -----------------------------

  app.get("/user", (req, res) => {
    if (req.session.user) {
      console.log(color.green("Fetched user session:"), req.session.user);

      return res.json(req.session.user);
    }
    return res.status(401).json({ user: null });
  });

  app.get("/checksum", async (req, res) => {
    // if (!req.session.user) return res.status(401);

    const id = 1;
    const user = await User.findOne({ where: { user_id: id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Use a Date object, not Date.now()
    const s = await user.update({ games_last_synced: new Date() });

    return res.json({ games_last_synced: s.dataValues.games_last_synced });
  });

  app.get("/test", (req, res) => {
    req.session.user = {
      id: 1,
      username: "testname",
      email: "testMail@test.com",
      games_last_synced: new Date(),
    };
    res.send("Test OK");
  });

  app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        error: "UserAlreadyExists",
        message: "A user with this email already exists.",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });

    res.json({ message: "User registered successfully!" });
  });

  app.post("/login", async (req, res) => {
    try {
      await login(req, res);
    } catch (e) {
      res.status(500).json({ error: "Login failed." });
    }
  });

  app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Logout failed" });
      }

      // Make sure to match your session cookie settings
      res.clearCookie("connect.sid", {
        path: "/", // match your session cookie path
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/externalGames", async (req, res) => {
    try {
      const games = await getExternalGames(req, res);
      res.json(games);
    } catch {
      res.status(500).json({ error: "Failed to fetch external games." });
    }
  });
  app.post("/addGame", async (req, res) => {
    console.log("ADD GAME");
    const user = req.session.user;

    if (!user) {
      console.log("Unauthorized.");
      return res.status(401).json({ error: "Not authenticated" });
    }

    let standard_game = new GameResponse(req.body);
    console.log(standard_game);

    return await addGame(standard_game, req, res);
  });
  app.get("/myGames", async (req, res) => {
    console.log("/mygames reached");
    console.log(req.session.user);
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const games = await getGames(req, res); // must return the data, not call res.json() inside
      return res.json(games);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get games" });
    }
  });
  // START SERVER -----------------------

  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}

startServer().catch((err) => console.error("Startup error:", err));
