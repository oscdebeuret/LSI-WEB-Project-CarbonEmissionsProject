<template>
  <form @submit.prevent="submit" class="bg-white p-6 rounded-xl shadow mb-6 space-y-4">
    <div>
      <label class="block text-gray-700 font-medium mb-1">Description de l’activité</label>
      <input type="text" v-model="description" class="input" required />
    </div>

    <div>
      <label class="block text-gray-700 font-medium mb-1">Énergie utilisée (en kWh)</label>
      <input type="number" v-model.number="energy" min="0" class="input" required />
    </div>

    <div>
      <label class="block text-gray-700 font-medium mb-1">Région</label>
      <select v-model="region" class="input">
        <option value="eu">Europe</option>
        <option value="us">États-Unis</option>
        <option value="cn">Chine</option>
        <option value="global">Global</option>
      </select>
    </div>

    <div v-if="loading" class="text-sm text-blue-500">Calcul en cours...</div>
    <div v-if="error" class="text-sm text-red-500">{{ error }}</div>

    <button :disabled="loading" type="submit" class="btn-primary">
      {{ loading ? 'Calcul...' : 'Calculer' }}
    </button>
  </form>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const description = ref('')
const energy = ref(0)
const region = ref('global')

const loading = ref(false)
const error = ref(null)

const emit = defineEmits(['calculation-done'])

async function submit() {
  loading.value = true
  error.value = null

  try {
    const response = await axios.post('https://beta3.api.climatiq.io/estimate', {
      emission_factor: {
        activity_id: 'electricity-energy_source_grid_mix',
        region: region.value,
      },
      parameters: {
        energy: energy.value,
        energy_unit: 'kWh',
      },
    }, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
      },
    })

    emit('calculation-done', {
      activity: description.value || 'Activité personnalisée',
      co2e: response.data.co2e,
      region: region.value.toUpperCase(),
    })
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors du calcul personnalisé.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-primary {
  background-color: #16a34a;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #15803d;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
