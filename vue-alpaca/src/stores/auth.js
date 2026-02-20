import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth',{

    state: () => {

        // Recuperamos la sesión persistida para mantener login entre reinicios.
        const saved = localStorage.getItem('auth')

        if(saved){
            // Restauramos usuario y token desde almacenamiento local.
            const { user, token } = JSON.parse(saved)
            return {
                user,
                token
            }
        }

        // Inicializamos estado vacío cuando no existe sesión previa.
        return {
            user: null,
            token: null
        }
    },

    actions:{
        setAuth(user, token){
            // Guardamos credenciales activas en memoria y persistencia local.
            this.user = user;
            this.token = token;
            localStorage.setItem('auth', JSON.stringify({ user, token }))
        },

        logout(){
            // Limpiamos toda la sesión para forzar acceso no autenticado.
            this.user = null;
            this.token = null;
            localStorage.removeItem('auth')
        }
    }
})
