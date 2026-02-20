const { contextBridge, ipcRenderer } = require('electron');

// Exponemos una API mínima y controlada para comunicar renderer y proceso principal.
contextBridge.exposeInMainWorld('electronAPI', {
    // Encapsulamos el login en IPC para evitar acceso directo a módulos de Node desde Vue.
    login:(email, password) => ipcRenderer.invoke('login', email, password),
    // Encapsulamos el registro para mantener un único punto de comunicación segura.
    register:(userData) => ipcRenderer.invoke('register', userData)
});