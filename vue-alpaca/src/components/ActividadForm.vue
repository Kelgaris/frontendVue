<template>
  <form @submit.prevent="guardarActividad" class="actividad-form">
    <input v-model="titulo" placeholder="Título" required />
    <input v-model="descripcion" placeholder="Descripción" />
    <select v-model="tipo" required>
      <option value="torneo">Torneo</option>
      <option value="taller">Taller</option>
      <option value="presentacion">Presentación</option>
    </select>
    <select v-model="juego" required>
      <option value="pokemon">Pokemon</option>
      <option value="magic">Magic</option>
      <option value="lorcana">Lorcana</option>
      <option value="onepiece">One Piece</option>
    </select>
    <input v-model="fechaInicio" type="datetime-local" :min="minDate" required />
    <input v-model="fechaFin" type="datetime-local" :min="minDate" required />
    <input v-model.number="capacidadMaxima" type="number" min="1" placeholder="Capacidad" required />
    <button type="submit">{{ actividadEditar ? 'Actualizar' : 'Crear' }}</button>
  </form>
</template>

<script>
export default {
  props: {
    actividadEditar: Object
  },
  data() {
    // Inicializamos el formulario con valores de edición o con defaults.
    return {
      titulo: this.actividadEditar?.titulo || '',
      descripcion: this.actividadEditar?.descripcion || '',
      juego: this.actividadEditar?.juego || '',
      tipo: this.actividadEditar?.tipo || 'taller',
      fechaInicio: this.actividadEditar ? new Date(this.actividadEditar.fechaInicio).toISOString().slice(0,16) : '',
      fechaFin: this.actividadEditar ? new Date(this.actividadEditar.fechaFin).toISOString().slice(0,16) : '',
      capacidadMaxima: this.actividadEditar?.capacidadMaxima || 20,
      minDate: new Date().toISOString().slice(0,16)
    }
  },
  methods: {
    guardarActividad() {
      // Validamos tipo y juego para evitar payloads incompletos.
      if(!this.tipo || !this.juego){
          alert('Debes seleccionar un tipo y un juego válido')
        return
      }
      // Comparamos fechas con el momento actual para impedir fechas pasadas.
      const ahora = new Date().toISOString().slice(0,16)
      if(this.fechaInicio < ahora) {
        alert('La fecha de inicio no puede ser anterior a hoy')
        return
      }
      if(this.fechaFin < ahora) {
        alert('La fecha de fin no puede ser anterior a hoy')
        return
      }
      // Construimos payload normalizado y lo emitimos al componente padre.
      const data = {
        titulo: this.titulo,
        descripcion: this.descripcion,
        tipo: this.tipo,
        juego: this.juego,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
        capacidadMaxima: this.capacidadMaxima
      }
      this.$emit('guardar', data)
    }
  }
}
</script>

<style scoped>
.actividad-form {
  border: 2px solid #624b9b;
  padding: 16px;
  border-radius: 12px;
  background-color: #a37fffaa;
  margin-bottom: 24px;
  width: 50%;
  display: flex;
  justify-content: center; 
  flex-direction: column;
}
input, select {
  display: block;
  margin-bottom: 8px;
  padding: 6px;
  width: 98%;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  background-color: #624b9b;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #826fb3;
}
.reservada { color: green; }
.cancelada { color: orange; }
.no-asistencia { color: red; }
</style>