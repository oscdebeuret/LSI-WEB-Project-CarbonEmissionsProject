<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ currentYear }} CO₂ Calculator. Tous droits réservés.
          </p>
        </div>

        <div class="flex space-x-6">
          <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
            <span class="sr-only">À propos</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </a>

          <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
            <span class="sr-only">Confidentialité</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </a>

          <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
            <span class="sr-only">Contact</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </div>

      <div class="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>Propulsé par l'API Climatiq pour des calculs d'émissions de CO₂ précis.</p>
        <p class="mt-1">Cette application est conçue pour sensibiliser à l'impact environnemental du numérique.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>
