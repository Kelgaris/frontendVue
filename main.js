const { app, BrowserWindow } = require('electron');
const path = require('path');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

// Desactivamos la caché HTTP para evitar que Electron sirva assets antiguos.
app.commandLine.appendSwitch('disable-http-cache');


async function startApp() {
  // Inicializamos la conexión a Mongo para asegurar disponibilidad del entorno.
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('AlpacaChinchona');

    function createWindow() {
    // Creamos la ventana principal con aislamiento de contexto por seguridad.
        const mainWindow = new BrowserWindow({
            width: 1920,
            height: 1080,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                enableRemoteModule: false,
                nodeIntegration: false
            },
            icon: path.join(__dirname,'/src/favicon.ico')
        });
        mainWindow.removeMenu();
        // Limpiamos la caché de sesión al arrancar para forzar el último build.
        mainWindow.webContents.session.clearCache().catch(() => {});
        // Cargamos el bundle compilado de Vue que usa la app de escritorio.
        mainWindow.loadFile('./vue-alpaca/dist/index.html', { hash: '/'});
    }

    app.whenReady().then(createWindow);

    // Definimos handlers IPC para que el renderer delegue llamadas de auth al proceso main.
    const { ipcMain } = require('electron');
    const axios = require('axios');

    ipcMain.handle('register', async (event, userData) => {
        try {
        // Reenviamos el registro al backend y devolvemos un estado homogéneo al renderer.
            const res = await axios.post('http://localhost:3000/api/auth/register', userData);
            return { status: 'success', message: res.data.message };
        } catch (err) {
        // Normalizamos el error para simplificar el manejo en frontend.
            return { status: 'error', message: err.response?.data?.message || 'Error desconocido' };
        }
    });

    ipcMain.handle('login', async (event, email, password) => {
      try {
        // Validamos credenciales contra el backend centralizado.
        const res = await axios.post(
          'http://localhost:3000/api/auth/login',
          { email, password }
        );
      
        return {
          status: 'success',
          // Devolvemos ambos nombres de propiedad para mantener compatibilidad entre versiones.
          user: res.data.usuario,
          usuario: res.data.usuario,
          token: res.data.token
        };
      
      } catch (err) {
        // Unificamos el formato de error para no romper el flujo de login en UI.
        return {
          status: 'error',
          message: err.response?.data?.message || 'Error login'
        };
      }
    });

}

startApp();
