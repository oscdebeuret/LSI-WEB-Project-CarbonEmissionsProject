<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob">
      </div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000">
      </div>
      <div
        class="absolute top-40 left-40 w-80 h-80 bg-teal-200 dark:bg-teal-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000">
      </div>
    </div>

    <div class="relative max-w-md w-full space-y-8">

      <div
        class="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700">
        <div class="space-y-6">
          <div v-if="error"
            class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
            </div>
          </div>

          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Connectez-vous
            </h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Choisissez votre méthode de connexion préférée
            </p>
          </div>

          <div class="space-y-4">
            <button @click="login" :disabled="loading"
              class="group relative w-full flex items-center justify-center px-6 py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl">
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              </div>

              <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
              </div>

              <div :class="{ 'opacity-0': loading }" class="flex items-center">
                <svg class="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span class="text-lg">Continuer avec Google</span>
              </div>
            </button>

            <button @click="loginMicrosoft" :disabled="true"
              class="group relative w-full flex items-center justify-center px-6 py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl">
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              </div>

              <div class="flex items-center">
                <svg class="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#00A4EF" d="M13 1h10v10H13z" />
                  <path fill="#7FBA00" d="M1 13h10v10H1z" />
                  <path fill="#FFB900" d="M13 13h10v10H13z" />
                </svg>
                <span class="text-lg">Continuer avec Microsoft</span>
                <span class="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">Bientôt</span>
              </div>
            </button>
          </div>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Connexion sécurisée
              </span>
            </div>
          </div>

          <div class="text-center space-y-3">
            <div class="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Sécurisé</span>
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Privé</span>
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-purple-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Rapide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const loading = ref(false);
const error = ref('');

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    const redirectTo = route.query.redirect || '/dashboard'
    await auth.signInWithGoogle(router, redirectTo)
  } catch (err) {
    error.value = err.message || 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

const loginMicrosoft = () => {
  console.log('Microsoft login - Coming soon!');
};
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

/* Effet de glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
