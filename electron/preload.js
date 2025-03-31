
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  showNotification: (notification) => ipcRenderer.send('show-notification', notification),
  // Add other IPC functions as needed
});
