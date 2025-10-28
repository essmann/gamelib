const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getGames: () => ipcRenderer.invoke('get-games'),
  addGame: (event, game) => ipcRenderer.invoke('add-game', game),
  updateGame: (event, game) => ipcRenderer.invoke('update-game', game),
  deleteGame: (event, id) => ipcRenderer.invoke('delete-game', id),
  
})
