<template>
  <div class="dashboard">

    <!-- HEADER -->
    <header class="top-header">
      <div class="welcome">
        <div class="avatar"><img src="../img/alpaca.png" alt="Logo Alpaquil"></div>
        <div>
          <h1>Bienvenido a Alpaca Chinchona</h1>
        </div>
      </div>
      <div class="header-actions">
        <button class="botonMenu">Inicio</button>
        <button class="botonMenu" @click="router.push('/actividades')">Actividades</button>
        <button class="botonMenu" @click="logout">Cerrar Sesión</button>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section class="hero">

      <img src="../img/lorwing.png" />

      <div class="hero-overlay">
        <span class="badge">PRÓXIMAMENTE</span>
        <h2>Nuevo set de Magic: Lorwing</h2>
      </div>

    </section>

    <!-- STATS -->
    <section class="stats">

      <div class="stat-card" v-if="proximaCita">
        <h4>PRÓXIMA CITA</h4>
        <h2>{{ new Date(proximaCita.fechaInicio).toLocaleString() }}</h2>
        <p>{{ proximaCita.titulo }}</p>
      </div>

      <div class="stat-card">
        <h4>TUS ALPACA POINTS</h4>
        <h2>1,250 pts</h2>
        <div class="points-icons">Anotate en actividades para ganar puntos</div>
      </div>

    </section>

    <!-- ACTIVIDADES -->
    <section class="trending">

      <div class="section-header">
        <h2>Proximas Actividades</h2>
      </div>

      <div class="actividades-grid">

        <div
          v-for="act in actividadesTendencia"
          :key="act._id"
          class="actividad-card"
        >
          <h3>{{ act.titulo }}</h3>
          <h4>{{ act.descripcion }}</h4>
          <p>{{ act.capacidadMaxima - act.reservas.length }} plazas libres</p>
        </div>
      
      </div>


    </section>

    <!-- NOTICIAS -->
    <section class="news">

      <h2>Comunidad y Noticias</h2>

      <div class="news-card">
        <img src="../img/explosivos.png" alt="" class="news-icon">
        <div>
          <span class="tag">JUEGO DEL MES</span>
          <h3>Exploding Kittens: Nueva Expansión</h3>
          <p>¡Ven a probarlo este viernes gratis!</p>
        </div>
      </div>

      <div class="news-card">
        <img src="../img/nuevosHorarios.png" alt="" class="news-icon">
        <div>
          <h3>Nuevos horarios de fin de semana</h3>
          <p>Ampliamos el cierre a las 22:00h los sábados.</p>
        </div>
      </div>

    </section>

  </div>
</template>

<script setup>
  import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

  // Inicializamos router y store para controlar navegación y sesión.
  const router = useRouter()
  const authStore = useAuthStore()

  // Declaramos el estado de actividades que usaremos en toda la vista.
  const actividades = ref([])

  async function cargarActividades() {
    // Consultamos actividades al backend para pintar dashboard actualizado.
    const res = await axios.get('http://localhost:3000/api/actividades')
    actividades.value = res.data
  }

  function logout() {
    // Cerramos sesión y redirigimos al login.
    authStore.logout()
    router.push('/')
  }

  // Ejecutamos la carga inicial cuando el componente termina de montar.
  onMounted(cargarActividades)

  const proximaCita = computed(() => {

  // Calculamos la fecha actual para filtrar actividades futuras reservadas.
  const ahora = new Date()

  return actividades.value
    .filter(act => {
      // Verificamos si el usuario actual tiene una reserva activa.
      const tieneReserva = act.reservas?.some(r =>
        r.usuarioId?.toString() === authStore.user._id &&
        r.estado === 'reservada'
      )
      const fecha = new Date(act.fechaInicio)
      return tieneReserva && fecha > ahora
    })
    .sort((a,b) =>
      new Date(a.fechaInicio) - new Date(b.fechaInicio)
    )[0]
  })

const actividadesTendencia = computed(() => {

  // Tomamos ventana de 14 días para destacar actividades próximas.
  const ahora = new Date()

  const limite = new Date()
  limite.setDate(ahora.getDate() + 14)

  return actividades.value
    .filter(act => {

      const fecha = new Date(act.fechaInicio)

      return fecha > ahora && fecha < limite

    })
    .sort((a,b)=>
      new Date(a.fechaInicio) - new Date(b.fechaInicio)
    )
    .slice(0,3)

  })

</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Instrument+Serif:ital@0;1&family=Miltonian+Tattoo&display=swap');



/* BASE DASHBOARD */
.dashboard {
  min-height: 100vh;
  padding: 40px 80px;
  background: linear-gradient(135deg, #cdb4db, #bde0fe, #c7f9cc);
  font-family: "Instrument Serif", serif;
}

/* HEADER */
.top-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:30px;
}

.welcome {
  display:flex;
  align-items:center;
  gap:15px;
}

.avatar {
  background:#624b9b;
  padding:14px;
  border-radius:20px;
  box-shadow:0 6px 15px rgba(0,0,0,0.1);
}

.avatar img{
  width:32px;
  height:32px;
}

.header-actions{
  display: flex;
  flex-direction: row;
  gap: 15px;
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

/* HERO */
.hero {
  position:relative;
  border-radius:30px;
  overflow:hidden;
  box-shadow:0 15px 35px rgba(0,0,0,0.5);
  margin-bottom:30px;
}

.hero img {
  width:100%;
  height:320px;
  object-fit:cover;
}

.hero-overlay {
  position:absolute;
  bottom:30px;
  left:30px;
  color:white;
}

.badge {
  background:#624b9b;
  padding:6px 14px;
  border-radius:20px;
  font-weight:bold;
}

/* STATS */
.stats {
  display:grid;
  grid-template-columns: repeat(2, 300px);
  gap:20px;
  margin-bottom:40px;
}

.stat-card {
  background:#ffffffaa;
  backdrop-filter: blur(15px);
  border-radius:20px;
  padding:25px;
  box-shadow:0 10px 25px rgba(0,0,0,0.5);
  transition:0.3s;
}

.stat-card:hover {
  transform:translateY(-4px);
}

/* ACTIVIDADES */
.section-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.section-header h2{
  color:#624b9b
}

.actividades-grid {
  display:flex;
  gap:20px;
  margin-top:20px;
}

.actividad-card {
  background:white;
  padding:25px;
  border-radius:22px;
  width:260px;
  box-shadow:0 10px 20px rgba(0,0,0,0.1);
  transition:0.3s;
  cursor:pointer;
}

.actividad-card:hover {
  transform:translateY(-6px) scale(1.03);
}

.actividad-card.activa {
  border:2px solid #624b9b;
}

.icon {
  font-size:24px;
  margin-bottom:10px;
}

.ver-todo{
  color: #624b9b;
  font-weight: bold;
}

/* NEWS */
.news {
  margin-top:40px;
}

.news h2{
  color:#624b9b;
}

.news-card {
  display:flex;
  gap:20px;
  align-items:center;
  background:white;
  border-radius:25px;
  padding:20px;
  margin-top:20px;
  box-shadow:0 8px 20px rgba(0,0,0,0.5);
  transition:0.3s;
}

.news-card:hover {
  transform:translateY(-3px);
}

.news-icon {
  width:70px;
  height:70px;
  border-radius:20px;
  background:linear-gradient(135deg,#66c2a5,#5e60ce);
}

.news-icon.alt {
  background:#ddd;
}

.tag {
  color:#624b9b;
  font-weight:bold;
  font-size:14px;
}

</style>
