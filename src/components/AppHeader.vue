<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-green-600">🌱 Carbon Tracker</h1>

      <nav v-if="isAuthenticated" class="flex items-center gap-6">
        <RouterLink to="/dashboard" class="hover:underline">Dashboard</RouterLink>
        <RouterLink to="/calculator" class="hover:underline">Calculateur</RouterLink>
        <RouterLink to="/favorites" class="hover:underline">Favoris</RouterLink>
        <RouterLink to="/compare" class="hover:underline">Graphiques</RouterLink>

        <div class="flex items-center gap-3">
          <img :src="user.picture" alt="Avatar" class="w-8 h-8 rounded-full" />
          <span class="text-sm font-medium">{{ user.name }}</span>
          <button @click="logout" class="text-red-500 hover:underline text-sm">Déconnexion</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = auth.isAuthenticated
const user = auth.user

function logout() {
  auth.logout()
  router.push('/')
}
</script>
