<template>
  <section class="max-w-3xl mx-auto mt-8">
    <h2 class="text-2xl font-bold text-green-700 mb-6">Calculateur d'émissions</h2>

    <label class="block mb-4">
      <span class="text-gray-700 font-medium">Type d'activité :</span>
      <select v-model="selectedActivity" class="mt-2 w-full rounded-md border-gray-300 shadow-sm">
        <option disabled value="">-- Choisir une activité --</option>
        <option value="cloud">Cloud computing</option>
        <option value="flight">Vol aérien</option>
        <option value="custom">Activité personnalisée</option>
      </select>
    </label>

    <component :is="currentFormComponent" @calculation-done="onCalculationDone" />

    <EmissionResultCard v-if="emissionResult" :result="emissionResult" @add-to-favorites="addToFavorites" />
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import CloudForm from '@/components/forms/CloudEmissionForm.vue'
import FlightForm from '@/components/forms/FlightEmissionForm.vue'
import CustomForm from '@/components/forms/CustomEmissionForm.vue'
import EmissionResultCard from '@/components/EmissionResultCard.vue'
import { useFavoritesStore } from '@/stores/favorites'

const selectedActivity = ref('')
const emissionResult = ref(null)

const favorites = useFavoritesStore()

const currentFormComponent = computed(() => {
  if (selectedActivity.value === 'cloud') return CloudForm
  if (selectedActivity.value === 'flight') return FlightForm
  if (selectedActivity.value === 'custom') return CustomForm
  return null
})

function onCalculationDone(result) {
  emissionResult.value = result
}

function addToFavorites(result) {
  favorites.add(result)
}
</script>
