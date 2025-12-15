import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";
import db from "./api/sqlite/connection/game_database";
import external_db from "./api/sqlite/connection/external_db";

// --- Endpoints ---
import addGame from "./api/endpoints/addGame";
import importGames from "./api/endpoints/import_export/importGames";
import { updateGame } from "./api/endpoints/updateGame";
import { deleteGame } from "./api/endpoints/deleteGame";
import { getGames } from "./api/endpoints/getGames";
import { getExternalGames } from "./api/endpoints/getExternalGames";

// Lists
import addList from "./api/endpoints/lists/addList";
import addToList from "./api/endpoints/lists/addToList";
import getLists from "./api/endpoints/lists/getLists";
import deleteFromList from "./api/endpoints/lists/deleteFromList";
import deleteList from "./api/endpoints/lists/deleteList";

import Game from "./api/game";


// --- Config ---
const isDev = !app.isPackaged;
console.log("[MAIN] isDev =", isDev);

// --- IPC handlers ---
ipcMain.handle("add-game", async (event: IpcMainInvokeEvent, gameData: Game) => {
  console.log("[IPC] add-game called:", gameData);
  const start = Date.now();
  try {
    const gameObject = new Game(gameData);
    const result = await addGame(db, gameObject);
    console.log(`[IPC] add-game completed in ${(Date.now()-start)/1000}s:`, result);
    return result;
  } catch (err) {
    console.error("[IPC] add-game error:", err);
    throw err;
  }
});

ipcMain.handle("update-game", async (event: IpcMainInvokeEvent, gameData: Game) => {
  console.log("[IPC] update-game called:", gameData);
  const start = Date.now();
  try {
    const gameObject = new Game(gameData);
    await updateGame(db, gameObject);
    console.log(`[IPC] update-game completed in ${(Date.now()-start)/1000}s`);
  } catch (err) {
    console.error("[IPC] update-game error:", err);
    throw err;
  }
});

ipcMain.handle("delete-game", async (event: IpcMainInvokeEvent, id: string | number) => {
  console.log("[IPC] delete-game called with id:", id);
  const start = Date.now();
  try {
    await deleteGame(db, id);
    console.log(`[IPC] delete-game completed in ${(Date.now()-start)/1000}s`);
  } catch (err) {
    console.error("[IPC] delete-game error:", err);
    throw err;
  }
});

ipcMain.handle("get-games", async () => {
  console.log("[IPC] get-games called");
  const start = Date.now();
  try {
    const rows = await getGames(db);
    const games = rows.map((row) => new Game(row));
    console.log(`[IPC] get-games fetched ${games.length} games in ${(Date.now()-start)/1000}s`);
    return games;
  } catch (err) {
    console.error("[IPC] get-games error:", err);
    throw err;
  }
});

ipcMain.handle("get-external-games", async (event, prefix: string) => {
  console.log("[IPC] get-external-games called with prefix:", prefix);
  const start = Date.now();
  try {
    const extGames = await getExternalGames(external_db, prefix);
    console.log(`[IPC] get-external-games fetched ${extGames.length} games in ${(Date.now()-start)/1000}s`);
    return extGames;
  } catch (err) {
    console.error("[IPC] get-external-games error:", err);
    throw err;
  }
});

ipcMain.handle("import-games", async (event, games: any[]) => {
  console.log("[IPC] import-games called with", games.length, "games");
  const start = Date.now();
  try {
    const result = await importGames(db, games);
    console.log(`[IPC] import-games completed in ${(Date.now()-start)/1000}s`);
    return result;
  } catch (err) {
    console.error("[IPC] import-games error:", err);
    throw err;
  }
});

// --- Lists ---
ipcMain.handle("add-list", async (event, name: string) => {
  console.log("[IPC] add-list called with name:", name);
  const start = Date.now();
  try {
    const result = await addList(db, name);
    console.log(`[IPC] add-list completed in ${(Date.now()-start)/1000}s:`, result);
    return result;
  } catch (err) {
    console.error("[IPC] add-list error:", err);
    throw err;
  }
});

ipcMain.handle("add-to-list", async (event, listId: number, gameId: number) => {
  console.log("[IPC] add-to-list called:", { listId, gameId });
  const start = Date.now();
  try {
    const result = await addToList(db, listId, gameId);
    console.log(`[IPC] add-to-list completed in ${(Date.now()-start)/1000}s:`, result);
    return result;
  } catch (err) {
    console.error("[IPC] add-to-list error:", err);
    throw err;
  }
});

ipcMain.handle("get-lists", async () => {
  console.log("[IPC] get-lists called");
  const start = Date.now();
  try {
    const lists = await getLists(db);
    console.log(`[IPC] get-lists fetched ${lists.length} lists in ${(Date.now()-start)/1000}s`);
    return lists;
  } catch (err) {
    console.error("[IPC] get-lists error:", err);
    throw err;
  }
});

ipcMain.handle("delete-list", async (event, listId: number) => {
  console.log("[IPC] delete-list called with id:", listId);
  const start = Date.now();
  try {
    const result = await deleteList(db, listId);
    console.log(`[IPC] delete-list completed in ${(Date.now()-start)/1000}s:`, result);
    return result;
  } catch (err) {
    console.error("[IPC] delete-list error:", err);
    throw err;
  }
});

ipcMain.handle("delete-from-list", async (event, listId: number, gameId: number) => {
  console.log("[IPC] delete-from-list called:", { listId, gameId });
  const start = Date.now();
  try {
    const result = await deleteFromList(db, listId, gameId);
    console.log(`[IPC] delete-from-list completed in ${(Date.now()-start)/1000}s:`, result);
    return result;
  } catch (err) {
    console.error("[IPC] delete-from-list error:", err);
    throw err;
  }
});

// --- Window creation ---
const createWindow = (): void => {
  console.log("[MAIN] Creating BrowserWindow...");
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      partition: "persist:main",
    },
  });

  if (isDev) {
    console.log("[MAIN] Loading dev URL...");
    win.loadURL("http://localhost:5173/");
  } else {
    console.log("[MAIN] Loading production file...");
    win.loadFile(path.join(__dirname, "../index.html"));
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
