<template>
  <div v-if="!auth.isAuthenticated">
    <button @click="auth.login" class="bg-blue-600 text-white px-4 py-2 rounded">
      Connexion Google
    </button>
  </div>
  <div v-else>
    Connecté : {{ auth.user.name }}
    <button @click="auth.logout" class="ml-4 text-red-600">Déconnexion</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>
