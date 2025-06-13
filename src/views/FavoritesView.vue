<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
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

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Vos favoris
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Retrouvez ici les calculs de votre empreinte carbone passés en favoris
            </p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-gray-600 dark:text-gray-300">Chargement...</div>
      <div v-else-if="favorites.length === 0" class="text-gray-500 dark:text-gray-400">Aucun favori pour le moment.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="(fav) in favorites" :key="fav.id">
          <FavoriteCard class="mt-3" @remove="remove(fav.id)" :emoji="fav.activityType === 'Vol' ? '✈️' : '🌿'"
            :result="fav.co2e" :fields="omitFields(fav, ['id', 'timestamp', 'co2e', 'uid', 'origin', 'activityType'])"
            :date="formatDate(fav.timestamp)" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getFavorites, removeFavorite } from '@/services/favoritesService'
import FavoriteCard from '@/components/FavoriteCard.vue'

const auth = useAuthStore()
const favorites = ref([])
const loading = ref(true)

async function loadFavorites() {
  if (auth.user?.uid) {
    favorites.value = (await getFavorites(auth.user.uid)).sort((a, b) => b.timestamp - a.timestamp)
  }
  loading.value = false
}

async function remove(id) {
  await removeFavorite(id)
  favorites.value = favorites.value.filter(fav => fav.id !== id)
}

function formatDate(ts) {
  const date = ts?.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleString('fr-FR')
}

// Supprime des clés inutiles pour les afficher dans fields
function omitFields(obj, keysToRemove) {
  const clone = { ...obj }
  keysToRemove.forEach(k => delete clone[k])
  return clone
}

onMounted(loadFavorites)
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
</style>
