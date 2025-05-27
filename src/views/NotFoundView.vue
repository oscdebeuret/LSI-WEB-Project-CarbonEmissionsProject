<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="text-center max-w-md w-full">
      <!-- Animation d'icône 404 -->
      <div class="relative mb-8">
        <div class="text-8xl font-bold text-gray-200 dark:text-gray-700 select-none">
          404
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8c0 1.01-.193 2.024-.546 2.946M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Titre et description -->
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Oups ! Page introuvable
      </h1>

      <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
        La page que vous recherchez n'existe pas ou a été déplacée.
        Peut-être qu'elle s'est évaporée comme du CO₂ dans l'atmosphère ! 🌱
      </p>

      <!-- Suggestions d'actions -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link to="/dashboard"
            class="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retour au tableau de bord
          </router-link>

          <router-link to="/calculator/cloud"
            class="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Nouveau calcul
          </router-link>
        </div>

        <!-- Liens rapides -->
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Ou explorez ces sections :
          </p>
          <div class="flex flex-wrap justify-center gap-2">
            <router-link to="/calculator/flight"
              class="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              Calcul vols
            </router-link>
            <router-link to="/calculator/custom"
              class="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              Calcul personnalisé
            </router-link>
            <router-link to="/comparisons"
              class="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              Comparaisons
            </router-link>
            <router-link to="/profile"
              class="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              Profil
            </router-link>
          </div>
        </div>
      </div>

      <!-- Message écologique -->
      <div
        class="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
        <div class="flex items-center justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 dark:text-green-400 mr-2" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-medium text-green-800 dark:text-green-300">
            Le saviez-vous ?
          </span>
        </div>
        <p class="text-xs text-green-700 dark:text-green-200 leading-relaxed">
          {{ randomEcoFact }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const ecoFacts = [
  "Chaque recherche Google génère environ 0,2g de CO₂. Utilisez des mots-clés précis pour réduire votre impact !",
  "Un email avec une pièce jointe de 1MB génère environ 19g de CO₂. Pensez à compresser vos fichiers !",
  "Regarder une heure de vidéo en streaming génère environ 36g de CO₂. Privilégiez la qualité standard quand possible.",
  "Éteindre votre ordinateur au lieu de le laisser en veille peut économiser jusqu'à 200kg de CO₂ par an.",
  "Le numérique représente 4% des émissions mondiales de gaz à effet de serre, soit plus que l'aviation civile !",
  "Un smartphone consomme plus d'énergie pour sa fabrication que pour 10 ans d'utilisation.",
  "Les centres de données consomment 1% de l'électricité mondiale. Choisissez des services cloud verts !",
  "Supprimer 30 emails peut économiser l'équivalent de l'énergie d'une ampoule allumée pendant une journée."
];

const randomEcoFact = computed(() => {
  const randomIndex = Math.floor(Math.random() * ecoFacts.length);
  return ecoFacts[randomIndex];
});
</script>

<style scoped>
@keyframes bounce {

  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    transform: translate3d(0, -15px, 0);
  }

  70% {
    transform: translate3d(0, -7px, 0);
  }

  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
