import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";
import { initDatabase } from "./api/sqlite/models/index";
import external_db from "./api/sqlite/connection/external_db";

// // --- Endpoints ---
import addGame from "./api/endpoints/addGame";
import { updateGame } from "./api/endpoints/updateGame";
import { deleteGame } from "./api/endpoints/deleteGame";
import { getGames } from "./api/endpoints/getGames";
import { getExternalGames } from "./api/endpoints/getExternalGames";
import { importData } from "./api/endpoints/importData";

// // Lists
import { addList } from "./api/endpoints/lists/addList";
import { addToList } from "./api/endpoints/lists/addToList";
import { getLists } from "./api/endpoints/lists/getLists";
import { deleteFromList } from "./api/endpoints/lists/deleteFromList";
import { deleteList } from "./api/endpoints/lists/deleteList";

// import Game from "./api/game";


// --- Config ---
const isDev = !app.isPackaged;
console.log("[MAIN] isDev =", isDev);

// --- IPC handlers ---
ipcMain.handle("add-game", async (event: IpcMainInvokeEvent, gameData: any) => {
  console.log("[IPC] add-game called:", gameData);
  const start = Date.now();
  try {

    const result = await addGame(gameData);
    console.log(`[IPC] add-game completed in ${(Date.now() - start) / 1000}s:`, result);
    return result;
  } catch (err) {
    console.error("[IPC] add-game error:", err);
    throw err;
  }
});

ipcMain.handle("update-game", async (event: IpcMainInvokeEvent, gameData: any) => {
  console.log("[IPC] update-game called:", gameData);
  const start = Date.now();
  try {

    await updateGame(gameData);
    console.log(`[IPC] update-game completed in ${(Date.now() - start) / 1000}s`);
  } catch (err) {
    console.error("[IPC] update-game error:", err);
    throw err;
  }
});

ipcMain.handle("delete-game", async (event: IpcMainInvokeEvent, id: number) => {
  console.log("[IPC] delete-game called with id:", id);
  const start = Date.now();
  try {
    await deleteGame(id);
    console.log(`[IPC] delete-game completed in ${(Date.now() - start) / 1000}s`);
  } catch (err) {
    console.error("[IPC] delete-game error:", err);
    throw err;
  }
});

ipcMain.handle("get-games", async () => {
  console.log("[IPC] get-games called");
  const start = Date.now();
  try {
    const rows = await getGames();

    console.log(`[IPC] get-games fetched ${rows.length} games in ${(Date.now() - start) / 1000}s`);
    return rows;
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
    console.log(`[IPC] get-external-games fetched ${extGames.length} games in ${(Date.now() - start) / 1000}s`);
    return extGames;
  } catch (err) {
    console.error("[IPC] get-external-games error:", err);
    throw err;
  }
});

ipcMain.handle('import-data', async (event, jsonString) => {
  console.log('[IPC] import-data called');

  const start = Date.now();

  try {
    // Call your importData function with the JSON string
    await importData(jsonString);

    console.log(`[IPC] import-data completed in ${(Date.now() - start) / 1000}s`);

    return { success: true };
  } catch (err) {
    console.error('[IPC] import-data error:', err);
    throw err; // IPC will propagate this error to the renderer
  }
});

// // --- Lists ---
ipcMain.handle("add-list", async (event, name: string) => {
  console.log("[IPC] add-list called with name:", name);
  const start = Date.now();
  try {
    const result = await addList(name);
    console.log(`[IPC] add-list completed in ${(Date.now() - start) / 1000}s:`, result);
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
    const result = await addToList(listId, gameId);
    console.log(`[IPC] add-to-list completed in ${(Date.now() - start) / 1000}s:`, result);
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
    const lists = await getLists();
    console.log(`[IPC] get-lists fetched ${lists.length} lists in ${(Date.now() - start) / 1000}s`);
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
    const result = await deleteList(listId);
    console.log(`[IPC] delete-list completed in ${(Date.now() - start) / 1000}s:`, result);
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
    const result = await deleteFromList(listId, gameId);
    console.log(`[IPC] delete-from-list completed in ${(Date.now() - start) / 1000}s:`, result);
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
app.whenReady().then(async () => {
  createWindow();

  console.log("Initializing sequelize database");
  await initDatabase();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
