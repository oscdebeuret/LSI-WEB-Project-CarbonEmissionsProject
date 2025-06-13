<template>
  <div class="relative z-10 max-w-2xl w-full mx-auto">

    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 transform">
      <div class="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6">
        <h1>✈️</h1>
        <h2> Empreinte carbone - Vol</h2>
      </div>
      <form @submit.prevent="calculate">
        <div class="space-y-3 text-sm">
          <div>
            <label class="block mb-1 text-sm text-gray-700 dark:text-gray-300">Origine</label>
            <input v-model="form.origin" type="text" placeholder="Ex: Paris" class="form-input" />
          </div>

          <div>
            <label class="block text-sm mb-1 text-gray-700 dark:text-gray-300">Destination</label>
            <input v-model="form.destination" type="text" placeholder="Ex: Berlin" class="form-input" />
          </div>
        </div>

        <button type="submit"
          class="w-full mt-5 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300">
          Calculer ✈️
        </button>
      </form>
    </div>

    <ResultCard v-if="result" class="mt-3" :emoji="'✈️'" :fields="result.fields" :result="result.result_value"
      :date="result.generated_at" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResultCard from '@/components/ResultCard.vue'
import { calculateTravelEmission } from '@/services/climatiq'
import { formatDate } from '@/utils'

const form = ref({
  travel_mode: 'air',
  origin: 'Paris',
  destination: 'New-York',
})

const result = ref(null)

async function calculate() {
  if (!form.value.destination || !form.value.origin) return
  try {
    const data = await calculateTravelEmission({ ...form.value })
    const now = new Date()

    result.value = {
      fields: {
        origine: data.origin.name,
        destination: data.destination.name,
        distance: `${data.distance_km} km`,
      },
      result_value: data.co2e.toFixed(2),
      generated_at: formatDate(now)
    }
  } catch (e) {
    console.error('Erreur API', e)
  }
}
</script>

<style scoped>
.form-select,
.form-input {
  @apply w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}
</style>
