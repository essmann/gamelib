const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getGames: (isLocal=false) => ipcRenderer.invoke('get-games', isLocal),
  addGame: ( game) => ipcRenderer.invoke('add-game', game),
  updateGame: ( game) => ipcRenderer.invoke('update-game', game),
  deleteGame: ( id) => ipcRenderer.invoke('delete-game', id),
  getExternalGames: (prefix) => ipcRenderer.invoke('get-external-games', prefix),
  register: (formData) => ipcRenderer.invoke('register', formData),
  login: (formData) => ipcRenderer.invoke('login', formData),
  importGames: (games) => ipcRenderer.invoke('import-games', games),
  
})
