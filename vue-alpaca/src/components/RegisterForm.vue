<template>
  <div class="bg">
    <div class="card">
      <img src="../img/alpaca.png" alt="Logo Alpaquil">
      <h1>Alpaca Chinchona</h1>
      <p class="subtitle">Bienvenido a la Alpaca</p>

      <form @submit.prevent="handleRegister">
        <input v-model="email" type="email" placeholder="Correo" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <input v-model="confirmarPassword" type="password" placeholder="Repitir contraseña"/> 

        <button type="submit">Registrarse</button>
      </form>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

      <router-link to="/" class="link">
        ¿Ya tienes cuenta? Inicia sesión.
      </router-link>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import '../css/login.css';

export default {
  setup() {
    // Declaramos estado reactivo del formulario de registro.
    const email = ref('')
    const password = ref('')
    const confirmarPassword = ref('')
    const errorMsg = ref('')
    const router = useRouter()

    async function handleRegister() {

      // Validamos longitud mínima de contraseña antes de enviar datos.

      if(password.value.length < 6){
        errorMsg.value = "La contraseña debe tener al menos 6 caracteres"
        return
      }
    
      // Verificamos coincidencia entre contraseña y confirmación.
      if(password.value !== confirmarPassword.value){
        errorMsg.value = "Las contraseñas deben coincidir"
        return
      }

      // Construimos payload de registro con campos necesarios.
      const userData = {
        email: email.value,
        password: password.value
      }
    
      try{
        // Enviamos alta de usuario al proceso principal mediante IPC.
        const result = await window.electronAPI.register(userData)
      
        if(result.token){   
          // Mostramos confirmación y redirigimos al login tras registro válido.
          errorMsg.value = "Usuario Registrado Correctamente."
          router.push('/')
        } else {
          // Propagamos mensaje de backend cuando el registro falla.
          errorMsg.value = result.message
        }
      
      } catch(error){
        // Capturamos errores inesperados para informar al usuario.
        errorMsg.value = error.response?.data?.message || "Ocurrió un error en el registro."
      }
    }

    return { email, password, confirmarPassword, errorMsg, handleRegister }
  }
}
</script>