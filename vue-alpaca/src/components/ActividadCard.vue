<template>

<div
  class="actividad-card"
  :class="{ activa: expandida || userRole==='admin' }"
  @click="toggleCard"
>

  <div class="card-header">

    <h3>{{ actividad.titulo }}</h3>

    <span class="arrow">▼</span>

  </div>

  <p>{{ actividad.juego }} | {{ actividad.tipo }}</p>

  <p>
    Plazas: {{ plazasReservadas }}/{{ actividad.capacidadMaxima }}
  </p>

  <div v-if="userRole==='user'">

    <button
      v-if="!tieneReserva && !actividadLlena"
      @click.stop="$emit('reservar',actividad)"
    >
      Reservar
    </button>

    <button
      v-if="tieneReserva"
      @click.stop="$emit('cancelar',actividad)"
    >
      Cancelar
    </button>

  </div>

  <transition name="expand">

    <div v-if="expandida || userRole==='admin'" class="contenido-expandido">

      <p>{{ actividad.descripcion }}</p>

      <p>
        {{ formatDate(actividad.fechaInicio) }}
      </p>

      <div v-if="userRole==='admin'">

          <div v-if="userRole==='admin'" class="admin-actions">

        <button
          class="editar-btn"
          @click.stop="$emit('editar', actividad)"
        >
          Editar
        </button>

        <button
          class="eliminar-btn"
          @click.stop="$emit('eliminar', actividad)"
        >
          Eliminar
        </button>
      </div>
        
        <h3>Reservas:</h3>
        <p
          v-for="res in actividad.reservas"
          :key="res.usuarioId"
        >
          👤 {{ res.usuarioNombre || res.usuarioId }} → {{ res.estado }}
        </p>
        <p v-if="actividad.reservas.length===0"> No hay reservas aún. </p>

      </div>

    </div>

  </transition>

</div>

</template>

<script>

export default {

props:{
  actividad:Object,
  userRole:String,
  reservaUsuario:Object,
  expandida:Boolean
},

computed:{

plazasReservadas(){
  // Contamos solo reservas activas para calcular plazas ocupadas reales.
  return this.actividad.reservas.filter(r=>r.estado==='reservada').length
},

actividadLlena(){
  // Comparamos plazas reservadas contra capacidad máxima para bloquear nuevas reservas.
  return this.plazasReservadas >= this.actividad.capacidadMaxima
},

tieneReserva(){
  // Verificamos si la reserva del usuario actual sigue en estado reservada.
  return this.reservaUsuario?.estado === 'reservada'
}

},

methods:{

toggleCard(){
  // Permitimos expandir tarjeta solo en vista de usuario para separar UX de admin.
  if(this.userRole==='user'){
    this.$emit('toggle')
  }
},

formatDate(dateStr){
  // Formateamos fecha en locale del cliente para mostrarla legible en la UI.
  return new Date(dateStr).toLocaleString()
}

}

}

</script>

<style scoped>

.actividad-card {
  border-radius: 20px;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff, #f9f7ff);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
}

.actividad-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.actividad-card.activa {
  border: 2px solid #a37fff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #5a3f7c;
  font-weight: 600;
}

.arrow {
  font-size: 1.2rem;
  color: #a37fff;
}


.admin-actions {
  display:flex;
  gap:8px;
}

.admin-actions button {
  border:none;
  padding:6px 10px;
  border-radius:8px;
  cursor:pointer;
  color:white;
  font-size:14px;
  margin-top: 10px;
}

.editar-btn {
  background:#8e6de0;
}

.eliminar-btn {
  background:#624b9b;
}

.admin-actions button:hover {
  transform: scale(1.1);
}

p {
  margin: 6px 0;
  font-size: 0.95rem;
  color: #555;
}

.contenido-expandido {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #444;
  border-top: 1px dashed #e0dfff;
  padding-top: 12px;
}

button{
  background-color: #624b9b;
  color: white;
}

</style>
