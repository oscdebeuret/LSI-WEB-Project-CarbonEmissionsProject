<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Mes Favoris</h1>

    <div v-if="loading" class="text-gray-600 dark:text-gray-300">Chargement...</div>
    <div v-else-if="favorites.length === 0" class="text-gray-500 dark:text-gray-400">Aucun favori pour le moment.</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(fav, index) in favorites"
        :key="fav.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition relative"
      >
        <p class="text-sm text-gray-500 mb-2">{{ formatDate(fav.timestamp) }}</p>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ fav.activityType.toUpperCase() }}
          <template v-if="fav.activityType !== 'Vol' && fav.region">• {{ fav.region }}</template>
        </h2>
        <p class="text-gray-700 dark:text-gray-300">Fournisseur : <strong>{{ fav.provider }}</strong></p>
        <p class="text-gray-700 dark:text-gray-300">Durée : <strong>{{ fav.duration }} h</strong></p>
        <p class="text-gray-700 dark:text-gray-300">CO₂e : <strong>{{ fav.co2e }} kg</strong></p>

        <button
          @click="remove(fav.id)"
          class="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm"
          title="Supprimer"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getFavorites, removeFavorite } from '@/services/favoritesService'

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

onMounted(loadFavorites)
</script>
