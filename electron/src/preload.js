const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getGames: (isLocal = false) => {
    console.log('[PRELOAD] getGames called, isLocal:', isLocal);
    return ipcRenderer.invoke('get-games', isLocal);
  },
  addGame: (game) => {
    console.log('[PRELOAD] addGame called:', game);
    return ipcRenderer.invoke('add-game', game);
  },
  updateGame: (game) => {
    console.log('[PRELOAD] updateGame called:', game);
    return ipcRenderer.invoke('update-game', game);
  },
  deleteGame: (id) => {
    console.log('[PRELOAD] deleteGame called, id:', id);
    return ipcRenderer.invoke('delete-game', id);
  },
  getExternalGames: (prefix) => {
    console.log('[PRELOAD] getExternalGames called, prefix:', prefix);
    return ipcRenderer.invoke('get-external-games', prefix);
  },
  register: (formData) => {
    console.log('[PRELOAD] register called:', formData);
    return ipcRenderer.invoke('register', formData);
  },
  login: (formData) => {
    console.log('[PRELOAD] login called:', formData);
    return ipcRenderer.invoke('login', formData);
  },
  importGames: (games) => {
    console.log('[PRELOAD] importGames called, count:', games.length);
    return ipcRenderer.invoke('import-games', games);
  },
  addList: (name) => {
    console.log('[PRELOAD] addList called, name:', name);
    return ipcRenderer.invoke('add-list', name);
  },
  addToList: (listId, gameId) => {
    console.log('[PRELOAD] addToList called, listId:', listId, 'gameId:', gameId);
    return ipcRenderer.invoke('add-to-list', listId, gameId);
  },
  getLists: () => {
    console.log('[PRELOAD] getLists called');
    return ipcRenderer.invoke('get-lists');
  },
  deleteList: (listId) => {
    console.log('[PRELOAD] deleteList called, id:', listId);
    return ipcRenderer.invoke('delete-list', listId);
  },
  deleteFromList: (listId, gameId) => {
    console.log('[PRELOAD] deleteFromList called, listId:', listId, 'gameId:', gameId);
    return ipcRenderer.invoke('delete-from-list', listId, gameId);
  }
});
