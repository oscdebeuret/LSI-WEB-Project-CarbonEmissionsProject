import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ActivityCalculatorView from '@/views/ActivityCalculatorView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import GraphComparisonView from '@/views/GraphComparisonView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/calculator',
    name: 'ActivityCalculator',
    component: ActivityCalculatorView,
    meta: { requiresAuth: true },
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/compare',
    name: 'GraphComparison',
    component: GraphComparisonView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
