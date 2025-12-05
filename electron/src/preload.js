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
  addList: (name) => ipcRenderer.invoke("add-list", name),
  addToList: (listId, gameId) => ipcRenderer.invoke("add-to-list", listId, gameId),
  getLists: () => ipcRenderer.invoke("get-lists"),
  deleteList: (listId) => ipcRenderer.invoke("delete-list", listId),
  deleteFromList: (listId, gameId) => ipcRenderer.invoke("delete-from-list", listId, gameId)
})
