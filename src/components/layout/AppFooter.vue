<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <div
              class="h-10 w-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              CO₂ Calculator
            </span>
          </div>

          <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
            Calculez, comprenez et réduisez votre empreinte carbone pour un avenir plus durable.
            Ensemble, agissons pour notre planète.
          </p>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Navigation
          </h3>
          <ul class="space-y-3">
            <li>
              <RouterLink to="/"
                class="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                Accueil
              </RouterLink>
            </li>
            <li v-if="isAuthenticated">
              <RouterLink to="/dashboard"
                class="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                Tableau de bord
              </RouterLink>
            </li>
            <li v-if="!isAuthenticated">
              <RouterLink to="/login"
                class="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                Se connecter
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Ressources
          </h3>
          <ul class="space-y-3">
            <li>
              <a href="https://www.climatiq.io/"
                class="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                Climatiq API
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center space-x-4 mb-4 md:mb-0">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              © 2025 CO₂ Calculator. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>
