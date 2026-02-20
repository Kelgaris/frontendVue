<template>
  <div class="bg">
    <div class="card">
      <img src="../img/alpaca.png" alt="Logo Alpaquil">
      <h1> Alpaca Chinchona</h1>
      <p class="subtitle">Accede a tu cuenta</p>

      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Correo" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />

        <button type="submit">Entrar</button>
      </form>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

      <router-link to="/register" class="link">
        ¿No tienes cuenta? Regístrate.
      </router-link>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import '../css/login.css';

export default {
  setup() {
    // Declaramos estado reactivo del formulario y navegación.
    const email = ref('')
    const password = ref('')
    const errorMsg = ref('')
    const router = useRouter()
    const authStore = useAuthStore()

    async function handleLogin() {
      try {
        // Enviamos credenciales al proceso principal mediante la API expuesta en preload.
        const result = await window.electronAPI.login(email.value, password.value)

        // Validamos respuestas de error normalizadas antes de continuar el flujo.
        if (!result || result.status === 'error') {
          errorMsg.value = result?.message || 'Error login'
          return
        }

        // Mantenemos compatibilidad con payloads que usen user o usuario.
        const usuario = result.usuario || result.user

        if (result.token && usuario) {
          // Persistimos sesión y redirigimos según rol autenticado.
          authStore.setAuth(usuario, result.token)

          router.push(usuario.role === 'admin'
            ? '/admin'
            : '/dashboard')
          return
        }

        // Mostramos error si el backend responde sin estructura esperada.
        errorMsg.value = 'Respuesta de login inválida'

      } catch(err){
        // Capturamos errores inesperados de red o runtime en el cliente.
        errorMsg.value = err.response?.data?.message || "Error login"
      }
    }

    function irRegistro() {
      router.push('/register')
    }

    return { email, password, errorMsg, handleLogin, irRegistro }
  },
}
</script>
