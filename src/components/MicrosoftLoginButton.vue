<template>
  <button @click="login"
    class="bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 flex items-center gap-2">
    <i class="fab fa-microsoft text-lg"></i>
    <span>Se connecter avec Microsoft</span>
  </button>
</template>

<script setup>
import * as msal from '@azure/msal-browser'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// Configuration MSAL
const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId: 'TON_CLIENT_ID_MICROSOFT', // à remplacer
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'http://localhost:8080',
  },
})

async function login() {
  try {
    const loginResponse = await msalInstance.loginPopup({
      scopes: ['user.read'],
    })

    const account = loginResponse.account
    const token = loginResponse.idToken

    auth.loginWithMicrosoft({
      name: account.name,
      email: account.username,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}`,
      token,
    })

    router.push('/dashboard')
  } catch (err) {
    console.error('Microsoft login failed:', err)
  }
}
</script>
