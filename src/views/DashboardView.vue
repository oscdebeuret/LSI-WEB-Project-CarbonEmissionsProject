<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Bienvenue dans le Dashboard</h1>
    <p v-if="auth.user">Connecté en tant que {{ auth.user.name }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>
