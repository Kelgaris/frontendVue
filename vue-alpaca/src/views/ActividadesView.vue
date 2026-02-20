<template>

<div class="dashboard">

  <!-- HEADER -->
  <header class="top-header">

    <div class="welcome">
      <h1>🦙 Actividades Alpaquiles</h1>
    </div>

    <div class="header-actions">
      <button class="botonMenu" @click="router.push('/dashboard')">Inicio</button>
      <button class="botonMenu active">Actividades</button>
      <button class="botonMenu" @click="logout">Cerrar Sesión</button>
    </div>

  </header>

  <!-- FILTROS -->
  <section class="filtros">

    <button
      v-for="tipo in tiposUnicos"
      :key="tipo"
      :class="{ activo: filtroTipo === tipo }"
      @click="filtroTipo = tipo"
    >
      {{ tipo }}
    </button>

    <button class="reset" @click="filtroTipo=null">
      Mostrar todo
    </button>

  </section>

  <!-- GRID -->
  <div class="actividades-grid">

    <ActividadCard
      v-for="actividad in actividadesFiltradas"
      :key="actividad._id"
      :actividad="actividad"
      :userRole="userRole"
      :reservaUsuario="actividad.reservas?.find(r => r.usuarioId?.toString() === userId)"
      :expandida="actividadExpandida === actividad._id"
      @toggle="toggleExpand(actividad._id)"
      @reservar="reservar"
      @cancelar="cancelar"
    />

  </div>

</div>

</template>

<script setup>

import ActividadCard from '@/components/ActividadCard.vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// Inicializamos dependencias de sesión y navegación.
const authStore = useAuthStore()
const router = useRouter()

// Extraemos identidad y rol para decisiones de UI y API.
const userId = authStore.user._id
const userRole = authStore.user.role

// Declaramos estado de actividades, filtro y tarjeta expandida.
const actividades = ref([])
const filtroTipo = ref(null)
const actividadExpandida = ref(null)

function toggleExpand(id){
  // Alternamos expansión para mostrar u ocultar detalles de una actividad.
  actividadExpandida.value =
    actividadExpandida.value === id ? null : id
}

async function cargarActividades() {
  // Cargamos actividades disponibles desde backend.
  const res = await axios.get('http://localhost:3000/api/actividades')
  actividades.value = res.data
}

async function reservar(actividad) {
  // Enviamos reserva del usuario actual y refrescamos listado.
  await axios.post(
    `http://localhost:3000/api/actividades/${actividad._id}/reservar`,
      { usuarioId: userId },
      { headers:{ Authorization:`Bearer ${authStore.token}` }}
  )
  cargarActividades()
}

async function cancelar(actividad) {
  // Cancelamos reserva del usuario actual y refrescamos listado.
  await axios.post(
  `http://localhost:3000/api/actividades/${actividad._id}/cancelar`,
    { usuarioId: userId },
    { headers:{ Authorization:`Bearer ${authStore.token}` }}
  )
  cargarActividades()
}

function logout(){
  // Cerramos sesión de usuario y volvemos al acceso.
  authStore.logout()
  router.push('/')
}

// Ejecutamos carga inicial al montar componente.
onMounted(cargarActividades)

const tiposUnicos = computed(() => {
  // Derivamos tipos únicos para construir filtros dinámicos.
  return [...new Set(actividades.value.map(a=>a.tipo))]
})

const actividadesFiltradas = computed(() => {

  // Tomamos fecha actual para descartar actividades pasadas.
  const ahora = new Date()

  // Aplicamos filtro por tipo si existe selección activa.
  let filtradas = filtroTipo.value
    ? actividades.value.filter(a => a.tipo === filtroTipo.value)
    : actividades.value

  return filtradas.filter(a =>
    new Date(a.fechaInicio) >= ahora
  )
})

</script>




<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Instrument+Serif:ital@0;1&family=Miltonian+Tattoo&display=swap');

.dashboard {
  min-height:90vh;
  max-height:90vh;
  padding:40px 80px;
  background:linear-gradient(135deg,#cdb4db,#bde0fe,#c7f9cc);
  font-family: "Instrument Serif", serif;
}

.welcome h1 { 
  color: #624b9b; 
}

.top-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:25px;
}

.avatar {
  background:#624b9b;
  padding:14px;
  border-radius:20px;
}

.header-actions{
  display:flex;
  gap:15px;
}

.botonMenu{
  background:linear-gradient(135deg,#cdb4db,#bde0fe,#c7f9cc);
  border:2px solid #624b9b;
  color:#624b9b;
  padding:8px 16px;
  border-radius:10px;
  cursor:pointer;
}

.filtros{
  margin-bottom:25px;
  display:flex;
  gap:10px;
}

.filtros button{
  border:none;
  padding:8px 14px;
  border-radius:20px;
  background: linear-gradient(135deg, #cdb4db, #bde0fe, #c7f9cc);
  backdrop-filter:blur(10px);
  cursor:pointer;
  color: #624b9b;
  font-weight:bold;
  border:#624b9b 2px solid;
  font-family: "Instrument Serif", serif;
}

.filtros .activo{
  background:#624b9b;
  color:white;
}


.actividades-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:25px;
}

</style>
