<template>
  <div class="reservas">
    <h1>Mis Reservas</h1>
    <p>Aquí se mostrarán tus reservas próximamente.</p>
  </div>
  <div class="reservas-grid">
  <ActividadCard
    v-for="reserva in reservasUsuario"
    :key="reserva._id"
    :actividad="reserva.actividad"
    :reservaUsuario="reserva"
    @cancelar="cancelarReserva"
  />
</div>
</template>

<script>
export default {
  // Definimos nombre de vista para depuración y trazabilidad en herramientas de Vue.
  name: 'ReservasView'
}
</script>

<style scoped>
.reservas {
  padding: 20px;
}
</style>
