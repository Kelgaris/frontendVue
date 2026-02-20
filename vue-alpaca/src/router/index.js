import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHashHistory } from 'vue-router'

import ActividadesView from '@/views/ActividadesView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ReservasView from '@/views/ReservasView.vue'

// Definimos el mapa de rutas principal de la aplicación.
const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminDashboardView, meta: { requiresAuth: true, role: 'admin'}},
  { path: '/actividades', component: ActividadesView, meta: { requiresAuth: true } },
  { path: '/reservas', component: ReservasView, meta: { requiresAuth: true } }
]

// Configuramos historial hash para compatibilidad con Electron.
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // Leemos sesión actual para aplicar reglas de acceso antes de navegar.
  const authStore = useAuthStore()
  const token = authStore.token
  const userRole = authStore.user?.role

  if (to.meta.requiresAuth && !token) {
    // Redirigimos a login cuando la ruta requiere autenticación.
    return next('/')
  }

  if (to.meta.role && to.meta.role !== userRole) {
    // Bloqueamos acceso cuando el rol no coincide con la ruta protegida.
    return next('/') 
  }

  // Permitimos navegación cuando se cumplen todas las validaciones.
  next()
})


export default router
