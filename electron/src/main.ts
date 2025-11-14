import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";
import dotenv from "dotenv";
import http from "http";
import https from "https";
import url from "node:url";
dotenv.config();
//load env variables from .env and prioritize those over the ones on machine. note, docker takes precedence.

// -- Environment variables ---
const BACKEND_PORT = process.env.BACKEND_PORT || 8080;
const BACKEND_HOST = process.env.BACKEND_HOST || "localhost";
const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_HOST}`;
// --- Detect production mode ---
const isDev = !app.isPackaged;

// --- Database setup ---
import db from "./api/sqlite/connection/game_database";
import external_db from "./api/sqlite/connection/external_db";

// --- API endpoints ---
import addGame from "./api/endpoints/addGame";
import { updateGame } from "./api/endpoints/updateGame";
import { deleteGame } from "./api/endpoints/deleteGame";
import { getGames } from "./api/endpoints/getGames";
import { getExternalGames } from "./api/endpoints/getExternalGames";
import Game from "./api/game";
import { URLSearchParams } from "url";

// --- IPC handlers ---
ipcMain.handle(
  "add-game",
  async (event: IpcMainInvokeEvent, gameData: Game): Promise<Game> => {
    console.log("Hey");
    const gameObject = new Game(gameData);
    let game = await addGame(db, gameObject);
    return game;
  }
);
//
ipcMain.handle(
  "update-game",
  async (event: IpcMainInvokeEvent, gameData: Game): Promise<void> => {
    const gameObject = new Game(gameData);
    return await updateGame(db, gameObject);
  }
);
//

ipcMain.handle(
  "delete-game",
  async (event: IpcMainInvokeEvent, id: string | number): Promise<void> => {
    console.log("Deleting game with id:", id);
    await deleteGame(db, id);
  }
);

ipcMain.handle(
  "get-games",
  async (event: IpcMainInvokeEvent, localGames: boolean): Promise<Game[]> => {
    const now = Date.now();
    const rows = await getGames(db);
    const games = rows.map((row) => new Game(row));
    console.log("Time taken:", (Date.now() - now) / 1000, "seconds");
    return games;
  }
);

ipcMain.handle(
  "get-external-games",
  async (event: IpcMainInvokeEvent, prefix: string): Promise<any> => {
    // console.log("Fetching external games with prefix:", prefix);
    // let ext_games = await getExternalGames(external_db, prefix);
    // console.log("External poster type: " + Object.prototype.toString.call(ext_games[0].poster));

    // return ext_games;
    const _url = url.format({
      protocol: "http",
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      pathname: "/externalGames",
      query: {
        search: prefix,
      },
    });
    console.log("url: " + _url);
    console.log("Request sent");

    const response = await fetch(_url);

    if (!response.ok) {
      throw new Error("HTTP error status: " + response.status);
    }

    const data = await response.json();
    return data;
  }
);

ipcMain.handle("login", async (_event, formData: any) => {
  console.log("Login reached in electron");

  const _url = url.format({
    protocol: "http",
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
    pathname: "/login",
  });
  console.log("url: " + _url);

  const response = await fetch(_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  const data = await response.json();
  return data;
});
ipcMain.handle("register", async (_event, formData: any) => {
  console.log("Register reached in electron");

  const _url = url.format({
    protocol: "http",
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
    pathname: "/register",
  });
  console.log("url: " + _url);

  const response = await fetch(_url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  const data = await response.json();
  return data;
});

// --- Create window ---
const createWindow = (): void => {
  console.log("Creating window...");
  console.log("__dirname:", __dirname);
  console.log("isDev:", isDev);
  console.log("Preload path:", path.join(__dirname, "./preload.js"));
  console.log("Dirname " + __dirname);
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"), // Adjust for dist folder
    },
  });
  // win.setMenuBarVisibility(false)

  if (isDev) {
    console.log("__dirname in dev:", __dirname);
    win.loadURL("http://localhost:5173/");
  } else {
    win.loadFile(path.join(__dirname, "../index.html")); // Adjust for build output
  }
};

// --- App lifecycle ---
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
