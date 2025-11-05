"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
// --- Detect production mode ---
var isDev = !electron_1.app.isPackaged;
// --- Database setup ---
var game_database_1 = __importDefault(require("./api/sqlite/game_database"));
var external_db_1 = __importDefault(require("./api/sqlite/external_db"));
// --- API endpoints ---
var addGame_1 = __importDefault(require("./api/endpoints/addGame"));
var updateGame_1 = require("./api/endpoints/updateGame");
var deleteGame_1 = require("./api/endpoints/deleteGame");
var getGames_1 = require("./api/endpoints/getGames");
var getExternalGames_1 = require("./api/endpoints/getExternalGames");
var game_1 = require("./api/game");
// --- IPC handlers ---
electron_1.ipcMain.handle('add-game', function (event, gameData) { return __awaiter(void 0, void 0, void 0, function () {
    var gameObject, game;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameObject = new game_1.Game(gameData);
                return [4 /*yield*/, (0, addGame_1.default)(game_database_1.default, gameObject)];
            case 1:
                game = _a.sent();
                return [2 /*return*/, game];
        }
    });
}); });
electron_1.ipcMain.handle('update-game', function (event, gameData) { return __awaiter(void 0, void 0, void 0, function () {
    var gameObject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameObject = new game_1.Game(gameData);
                return [4 /*yield*/, (0, updateGame_1.updateGame)(game_database_1.default, gameObject)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
electron_1.ipcMain.handle('delete-game', function (event, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Deleting game with id:', id);
                return [4 /*yield*/, (0, deleteGame_1.deleteGame)(game_database_1.default, id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('get-games', function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, rows, games;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                now = Date.now();
                return [4 /*yield*/, (0, getGames_1.getGames)(game_database_1.default)];
            case 1:
                rows = _a.sent();
                games = rows.map(function (row) { return new game_1.Game(row); });
                console.log('Time taken:', (Date.now() - now) / 1000, 'seconds');
                return [2 /*return*/, games];
        }
    });
}); });
electron_1.ipcMain.handle('get-external-games', function (event, prefix) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Fetching external games with prefix:', prefix);
                return [4 /*yield*/, (0, getExternalGames_1.getExternalGames)(external_db_1.default, prefix)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
// --- Create window ---
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path_1.default.join(__dirname, '../preload.js'), // Adjust for dist folder
        },
    });
    if (isDev) {
        win.loadURL('http://localhost:5173/');
    }
    else {
        win.loadFile(path_1.default.join(__dirname, '../index.html')); // Adjust for build output
    }
};
// --- App lifecycle ---
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
