<template>
  <form @submit.prevent="calculate">
    <div>
      <label>CPU (heures)</label>
      <input type="number" v-model.number="cpu" min="0" required />
    </div>

    <div>
      <label>RAM (Go)</label>
      <input type="number" v-model.number="ram" min="0" required />
    </div>

    <div>
      <label>Stockage (Go·mois)</label>
      <input type="number" v-model.number="storage" min="0" required />
    </div>

    <button type="submit">Calculer</button>

    <div v-if="result !== null">
      <p>Résultat CO₂e total : {{ result }} kgCO₂e</p>
    </div>

    <div v-if="error">{{ error }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const cpu = ref(0)
const ram = ref(0)
const storage = ref(0)
const result = ref(null)
const error = ref(null)

const CLIMATIQ_API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY

async function calculate() {
  result.value = null
  error.value = null

  const headers = {
    Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
    'Content-Type': 'application/json',
  }

  try {
    let total = 0

    if (cpu.value > 0) {
      const resCpu = await axios.post('https://beta3.api.climatiq.io/estimate', {
        emission_factor: { activity_id: 'compute-server', region: 'eu' },
        parameters: { hours: cpu.value },
      }, { headers })

      total += resCpu.data.co2e
    }

    if (ram.value > 0) {
      const resRam = await axios.post('https://beta3.api.climatiq.io/estimate', {
        emission_factor: { activity_id: 'compute-ram', region: 'eu' },
        parameters: { gb: ram.value },
      }, { headers })

      total += resRam.data.co2e
    }

    if (storage.value > 0) {
      const resStorage = await axios.post('https://beta3.api.climatiq.io/estimate', {
        emission_factor: { activity_id: 'compute-storage', region: 'eu' },
        parameters: { gb: storage.value, months: 1 },
      }, { headers })

      total += resStorage.data.co2e
    }

    result.value = total.toFixed(4)
  } catch (err) {
    error.value = 'Erreur lors du calcul des émissions.'
    console.error(err)
  }
}
</script>
