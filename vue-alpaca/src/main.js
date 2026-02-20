import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// Creamos la instancia raíz de Vue para inicializar la aplicación.
const app = createApp(App)

// Registramos Pinia y router antes de montar la aplicación.
app.use(createPinia())
app.use(router)

// Montamos la aplicación en el contenedor principal del HTML.
app.mount('#app')
