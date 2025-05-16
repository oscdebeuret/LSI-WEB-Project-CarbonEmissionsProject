<template>
  <form @submit.prevent="submit" class="bg-white p-6 rounded-xl shadow mb-6 space-y-4">
    <div>
      <label class="block text-gray-700 font-medium mb-1">CPU (heures)</label>
      <input type="number" v-model.number="cpuHours" min="0"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
    </div>

    <div>
      <label class="block text-gray-700 font-medium mb-1">Mémoire RAM (Go)</label>
      <input type="number" v-model.number="ramGb" min="0"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
    </div>

    <div>
      <label class="block text-gray-700 font-medium mb-1">Stockage (Go·mois)</label>
      <input type="number" v-model.number="storageGb" min="0"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
    </div>

    <div v-if="loading" class="text-sm text-blue-500">Calcul en cours...</div>
    <div v-if="error" class="text-sm text-red-500">{{ error }}</div>

    <button :disabled="loading" type="submit"
      class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60">
      {{ loading ? 'Calcul...' : 'Calculer' }}
    </button>
  </form>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const cpuHours = ref(0)
const ramGb = ref(0)
const storageGb = ref(0)
const loading = ref(false)
const error = ref(null)

const emit = defineEmits(['calculation-done'])

async function submit() {
  const results = []
  loading.value = true
  error.value = null

  try {
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
    }

    if (cpuHours.value > 0) {
      const resCpu = await axios.post('https://beta3.api.climatiq.io/estimate', {
        emission_factor: { activity_id: 'compute-server', region: 'eu' },
        parameters: { hours: cpuHours.value },
      }, { headers })
      results.push({ activity: 'CPU', co2e: resCpu.data.co2e, region: 'EU' })
    }

    if (ramGb.value > 0) {
      const resRam = await axios.post('https://beta3.api.climatiq.io/estimate', {
        emission_factor: { activity_id: 'compute-ram', region: 'eu' },
        parameters: { gb: ramGb.value },
      }, { headers })
      results.push({ activity: 'RAM', co2e: resRam.data.co2e, region: 'EU' })
    }

    if (storageGb.value > 0) {
      const resStorage = await axios.post('https://beta3.api.climatiq.io/estimate', {
        emission_factor: { activity_id: 'compute-storage', region: 'eu' },
        parameters: { gb: storageGb.value, months: 1 },
      }, { headers })
      results.push({ activity: 'Stockage', co2e: resStorage.data.co2e, region: 'EU' })
    }

    const total = results.reduce((sum, r) => sum + r.co2e, 0)

    emit('calculation-done', {
      activity: 'Cloud computing',
      co2e: total,
      region: 'EU',
      details: results,
    })
  } catch {
    error.value = 'Erreur lors du calcul.'
  } finally {
    loading.value = false
  }
}
</script>
