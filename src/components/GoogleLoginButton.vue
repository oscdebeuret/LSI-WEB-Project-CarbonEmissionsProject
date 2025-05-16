<template>
  <GoogleLogin :client-id="clientId" :callback="handleSuccess"
    class="cursor-pointer bg-white border px-4 py-2 rounded shadow flex items-center gap-2">
    <i class="fab fa-google text-red-500"></i>
    <span>Se connecter avec Google</span>
  </GoogleLogin>
</template>

<script setup>
import { GoogleLogin } from 'vue3-google-login'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const router = useRouter()
const auth = useAuthStore()

function handleSuccess(response) {
  const { credential } = response
  if (!credential) {
    console.error('Aucun token reçu depuis Google')
    return
  }

  auth.loginWithGoogle(credential)
  router.push('/dashboard')
}
</script>
