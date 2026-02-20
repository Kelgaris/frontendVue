<template>
  <div class="admin-dashboard">

    <!-- HEADER -->
    <header class="admin-header">
      <h1>🦙 Panel de Administrador</h1>

      <nav>
        <button class="botonMenu" @click="abrirFormulario">Crear Actividad</button>
        <button class="botonMenu" @click="logout">Cerrar Sesión</button>
      </nav>
    </header>

    <!-- FORMULARIO INLINE -->
    <div v-if="mostrarFormulario" class="formulario-wrapper">

      <ActividadForm
        @guardar="crearOActualizar"
        :actividadEditar="actividadEditar"
        class="formulario"
      />

    </div>

    <!-- GRID -->
    <div class="actividades-grid">

      <div
        v-for="actividad in actividades"
        :key="actividad._id"
        class="actividad-wrapper"
      >


        <div
          v-if="actividadTerminada(actividad)"
          class="terminada-overlay"
        >
          TERMINADA
        </div>

        <ActividadCard
          :actividad="actividad"
          :userRole="userRole"
          @editar="editarActividad"
          @eliminar="eliminarActividad"
        />

      </div>

    </div>

  </div>
</template>

<script>
import ActividadCard from '@/components/ActividadCard.vue'
import ActividadForm from '@/components/ActividadForm.vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {

  // Registramos componentes de tarjeta y formulario para gestión de actividades.
  components: { ActividadCard, ActividadForm },

  setup() {

    // Inicializamos store y router para control de sesión y navegación.
    const authStore = useAuthStore()
    const router = useRouter()

    // Declaramos estado de listado, edición y visibilidad de formulario.
    const actividades = ref([])
    const actividadEditar = ref(null)
    const mostrarFormulario = ref(false)

    // Leemos rol para renderizar capacidades de administración.
    const userRole = authStore.user.role

    async function cargarActividades() {
      // Consultamos actividades para mantener el panel sincronizado.
      const res = await axios.get('http://localhost:3000/api/actividades')
      actividades.value = res.data
    }


    function actividadTerminada(actividad) {
      // Comparamos fecha de inicio para marcar actividades finalizadas.
      const ahora = new Date()
      const fechaInicio = new Date(actividad.fechaInicio)
      return fechaInicio < ahora
    }

    function abrirFormulario() {
      // Preparamos formulario en modo creación y alternamos su visibilidad.
      actividadEditar.value = null
      mostrarFormulario.value = !mostrarFormulario.value
    }

    function editarActividad(act) {
      // Cargamos actividad objetivo y abrimos formulario en modo edición.
      actividadEditar.value = act
      mostrarFormulario.value = true
    }

    async function eliminarActividad(act) {

      // Confirmamos la eliminación para evitar borrados accidentales.
      if (!confirm('¿Eliminar actividad?')) return

      // Eliminamos en backend y retiramos del estado local.
      await axios.delete(
        `http://localhost:3000/api/actividades/${act._id}`,
        {
          headers: { Authorization: `Bearer ${authStore.token}` }
        }
      )

      actividades.value = actividades.value.filter(
        a => a._id !== act._id
      )

    }

    async function crearOActualizar(data) {

      if (actividadEditar.value) {

        // Actualizamos actividad existente cuando estamos en modo edición.

        const res = await axios.put(
          `http://localhost:3000/api/actividades/${actividadEditar.value._id}`,
          data,
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        )

        const index = actividades.value.findIndex(
          a => a._id === res.data._id
        )

        if (index !== -1) {
          actividades.value[index] = res.data
        }

      } else {

        // Creamos actividad nueva cuando no existe una actividad en edición.

        const res = await axios.post(
          'http://localhost:3000/api/actividades',
          data,
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        )

        actividades.value.unshift(res.data)

      }

      mostrarFormulario.value = false
      actividadEditar.value = null
    }

    function logout() {
      // Cerramos sesión admin y redirigimos al login.
      authStore.logout()
      router.push('/')
    }

    // Cargamos actividades al montar para pintar datos iniciales del panel.
    onMounted(cargarActividades)

    return {
      actividades,
      userRole,
      actividadEditar,
      mostrarFormulario,
      abrirFormulario,
      editarActividad,
      eliminarActividad,
      crearOActualizar,
      logout,
      actividadTerminada
    }
  }
}
</script>

<style scoped>

.admin-dashboard {
  min-height: 94vh;
  padding: 20px;
  background: linear-gradient(135deg, #cdb4db, #bde0fe, #c7f9cc);
}

.admin-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
}

.admin-header nav{
  gap: 10px;
}

.botonMenu {
  background: linear-gradient(135deg, #cdb4db, #bde0fe, #c7f9cc);
  padding:8px 16px;
  border-radius:5%;
  cursor:pointer;
  transition:0.3s;
  color: #624b9b;
  border: #624b9b 2px solid;
  font-family: "Instrument Serif", serif;
}

.botonMenu:hover {
  transform:scale(1.1);
}


.actividades-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
  gap:18px;
}

nav{
  display:flex;
  align-items:center;
  flex-direction: row;
  width: 20%;
}


.actividad-wrapper {
  position:relative;
}


.terminada-overlay {
  position: absolute;
  top: 30px;
  left: 10px;
  background:rgba(120,120,120,0.9);
  color:rgb(255, 0, 0);
  padding:18px 85px;
  border-radius:6px;
  font-weight:bold;
  z-index:10;
  pointer-events:none;
}

.formulario-wrapper {
  position: fixed;  
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 90%;
  max-width: 700px;
}

.formulario-wrapper::before{
  content:"";
  position: fixed;
  inset:0;
  backdrop-filter: blur(4px);
  z-index:-1;
}

.formulario{
  width:100%;
  max-width:700px; 
}

.formulario > * {
  width:98%;
}

</style>
