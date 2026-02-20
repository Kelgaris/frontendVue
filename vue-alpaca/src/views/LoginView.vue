<!-- LoginView.vue -->
<template>
  <div>
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  // Registramos el formulario de login como componente principal de esta vista.
  components: { LoginForm },
}
</script>
