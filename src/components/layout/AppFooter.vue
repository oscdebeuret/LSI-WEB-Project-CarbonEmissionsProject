<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <div class="container mx-auto px-4 py-6">
      <div class="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">
          &copy; {{ currentYear }} CO₂ Calculator. Tous droits réservés.
        </p>
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
