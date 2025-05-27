<template>
  <div class="p-4 text-center">
    <h2 class="text-2xl font-bold">Connexion</h2>
    <p class="mt-2 text-gray-600">Clique pour te connecter :</p>
    <button @click="login" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
      Connexion Google
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

const login = () => auth.signInWithGoogle()
</script>
