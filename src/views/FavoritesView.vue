<template>
  <section class="max-w-4xl mx-auto mt-8">
    <h2 class="text-2xl font-bold text-green-700 mb-6">Mes favoris</h2>

    <div v-if="favorites.length === 0" class="text-gray-500 text-center">
      Aucun résultat enregistré pour l’instant.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EmissionResultCard v-for="(item, index) in favorites" :key="index" :result="item" :show-delete="true"
        @delete="removeFavorite(index)" />
    </div>
  </section>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites'
import EmissionResultCard from '@/components/EmissionResultCard.vue'

const favoritesStore = useFavoritesStore()
const favorites = favoritesStore.items

function removeFavorite(index) {
  favoritesStore.remove(index)
}
</script>
