import express from "express";
import dotenv from "dotenv";
import db from "./database/connection.js";

import Poster from "./database/models/poster.js";
import Game from "./database/models/game.js";
import User from "./database/models/user/user.js";
import UserGame from "./database/models/user/userGame.js";

import getExternalGames from "./database/endpoints/getExternalGames.js";

import session from "express-session";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  // Import connect-session-sequelize dynamically
  const SequelizeStoreFactory = (await import("connect-session-sequelize")).default;
  const SequelizeStore = SequelizeStoreFactory(session.Store);

  // Create and sync the session store
  const store = new SequelizeStore({ db });
  await store.sync();

  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "a_fallback_secret_for_dev_only",
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

  // Body parsing middleware
  app.use(express.json());

  // Log session data
  app.use((req, res, next) => {
    console.log("Session:", req.session);
    next();
  });

  // Helper function for password hashing
  async function hashPassword(password: string) {
    try {
      const hashedPw = await bcrypt.hash(password, 10);
      console.log("Hashed Password:", hashedPw);
      return hashedPw;
    } catch (err) {
      console.error("Error hashing password:", err);
      throw err;
    }
  }

  // Database initialization
  await User.sync();
  await Game.sync();
  await Poster.sync();
  await UserGame.sync();

  const testPw = await hashPassword("123");
  await User.create({
    username: "essmann",
    email: "ken@gmail.com",
    password: testPw,
  });

  const [dbs] = await db.query("SHOW DATABASES");
  const [tables] = await db.query("SHOW TABLES");
  console.log("Databases:", dbs);
  console.log("Tables:", tables);
  console.log("Database connected successfully.");

  // Routes
  app.get("/", (req, res) => res.send("Hello World!"));
  app.get("/profile", (req, res) => res.send("Hello World!"));

  app.get("/test", (req, res) => {
    req.session.user = { id: 1, username: "testname" };
    console.log(req.session);
    res.send("Test OK");
  });

  app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const emailExists = (await User.findOne({ where: { email } })) !== null;

    if (emailExists) {
      return res.status(409).json({
        error: "UserAlreadyExists",
        message: "A user with this email already exists.",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash, email });
    console.log("User successfully registered");
    res.json({ message: "User registered successfully!" });
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.dataValues.password);
      if (passwordMatch) {
        req.session.user = {
          id: user.dataValues.user_id,
          username: user.dataValues.username,
        };
      }
    }
    console.log(req.session);
    res.send("Login endpoint");
  });

  app.get("/logout", (req, res) => res.send("Logout endpoint"));

  app.get("/externalGames", async (req, res) => {
    try {
      const games = await getExternalGames(req, res);
      res.json(games);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch external games." });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}

// Run the async server starter
startServer().catch((err) => console.error(err));
