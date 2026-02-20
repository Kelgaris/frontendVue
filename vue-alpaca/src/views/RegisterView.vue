<!-- RegisterView.vue -->
<template>
  <div>
    <RegisterForm />
  </div>
</template>

<script>
import RegisterForm from '@/components/RegisterForm.vue';

export default {
  // Registramos el formulario de registro como componente principal de esta vista.
  components: { RegisterForm },
}
</script>
