const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getGames: () => ipcRenderer.invoke('get-games'),
  addGame: ( game) => ipcRenderer.invoke('add-game', game),
  updateGame: ( game) => ipcRenderer.invoke('update-game', game),
  deleteGame: ( id) => ipcRenderer.invoke('delete-game', id),
  
})
